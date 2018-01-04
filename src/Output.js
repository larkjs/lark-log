/**
 * Stream output.
 * If stream given, the output instance will write data into that stream. Or if path is given, the output instance
 * will maintain a stream on the file. In this case, any change (like file-path, encoding ...) will impact the
 * stream immediately.
 * In other cases, output will use stdout as the output stream.
 **/
'use strict';


const _             = require('lodash');
const assert        = require('assert');
const bluebird      = require('bluebird');
const dateformat    = require('dateformat');
const debug         = require('debug')('lark-log.Output');
const fs            = require('fs');
const misc          = require('vi-misc');
const mkdirp        = require('mkdirp');
const path          = require('path');
const LarkConfig    = require('lark-config');
const { Writable }  = require('stream');

const mkdirpAsync = bluebird.promisify(mkdirp);
const FILE_MODE_NOT_EXECUTABLE = 0o666;  // logs should not be executable
const DEFAULT_LOG_FILE_OPTIONS = {
    flags: 'a+',    // append content to log files
    mode: FILE_MODE_NOT_EXECUTABLE,
};


class Output {

    constructor(...args) {
        debug('construct');
        this.writable = null;
        this.config = new LarkConfig();
        this.configure(...args);
    }

    configure(...configs) {
        debug('configure');
        for (const config of configs) {
            assert(config instanceof Object, `Invalid configure argument ${config}`);
            if (config instanceof Writable) {
                this.writable = config;
            }
            else {
                this.config.use(config);
            }
        }
        if (!this.config.has('path') || !this.config.get('path')) {
            this.path = null;
        }
        else {
            this.path = [
                this.config.get('path-prefix') || '',
                this.config.get('path'),
                this.config.get('path-suffix') || '',
            ].join('');
            if (this.path.includes('<%')) {
                try {
                    this.path = _.template(this.path);
                }
                catch (error) {
                    throw new Error(`Error on compiling path format [${this.path}]: ${error.message}`);
                }
            }
        }
        if (this.config.has('format')) {
            try {
                this.format = _.template(this.config.get('format'));
            }
            catch (error) {
                throw new Error(`Error on compiling log format [${this.config.get('format')}]: ${error.message}`);
            }
        }
        else {
            this.format = null;
        }
        return this;
    }    

    async getWritable(data = {}) {
        if (this.writable instanceof Writable) {
            if (!this.writable.path || !(this.path instanceof Function)) {
                return this.writable;
            }
            const writablePath = this.path(data);
            if (this.writable.path === writablePath) {
                return this.writable;
            }
            this.close();
        }

        if (!this.path) {
            this.writable = process.stdout;
            return this.writable;
        }

        let writablePath = this.path instanceof Function ? this.path(data) : this.path;
        writablePath = misc.path.absolute(writablePath);
        await mkdirpAsync(path.dirname(writablePath, { mode: FILE_MODE_NOT_EXECUTABLE }));
        const fileOptions = _.defaults(this.config.get('file') || {}, DEFAULT_LOG_FILE_OPTIONS);
        debug(fileOptions);
        this.writable = fs.createWriteStream(writablePath, fileOptions);
        debug(`create a write stream on [${this.writable.path}]`);
        return this.writable;
    }

    /**
     * Close the stream. The stream may be re-created again
     * by calling write method
     **/
    close() {
        if (!(this.writable instanceof Writable) || this.writable === process.stdout) {
            return this;
        }
        debug(`write stream on [${this.writable.path}] closed!`);
        this.writable.end();
        this.writable = null;
        return this;
    }

    async write(data) {
        debug('write');
        assert(data instanceof Object, 'Data to write should be an Object');
        data.method = data.method || 'METHOD';
        data.date = data.date || dateformat;
        const writable = await this.getWritable(data);
        if (this.format instanceof Function) {
            data = this.format(data);
        }
        if (data.length >= this.config.get('line-max-length')) {
            data = data.slice(0, this.config.get('line-max-length')) + '...';
        }
        return new Promise((resolve, reject) => {
            writable.write(`${data}\n`, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }  

}


module.exports = Output;
