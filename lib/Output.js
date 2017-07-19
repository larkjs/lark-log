/**
 * Output logs via stream
 **/
'use strict';

const assert    = require('assert');
const debug     = require('debug')('lark-log.Output');
const extend    = require('extend');
const template  = require('lodash.template');

const Writable  = require('stream').Writable;

class Output {
    constructor(stream, options) {
        debug('construct');
        if (stream !== process.stdout && stream !== process.stderr) {
            assert(stream instanceof Writable, 'Stream for output must be a writable stream');
        }
        assert(options instanceof Object, 'Options for output must be an object');

        this.stream = stream;
        this.config = extend(true, {
            path: 'system.log',
            format: '<%= method %>:\t<%= date("yyyy-mm-dd HH:MM:ss")%>\t<%= content %>',
            maxLength: 10000,
        }, options);

        let compiled = info => info.toString();

        if (this.config.format instanceof Function) {
            compiled = this.config.format;
        }
        else if ('string' === typeof this.config.format && this.config.format.match(/<%.*%>/)) {
            try {
                compiled = template(this.config.format);
            }
            catch (error) {
                throw new Error(`Fail to compile output format '${this.config.format}' with error '${error.message}'`);
            }
        }
        this.render = info => compiled(info);
    }
    output(info) {
        debug('output');
        let content = this.render(info);
        if (this.config.maxLength >= 0 && content.length > this.config.maxLength) {
            content = content.slice(0, this.config.maxLength);
        }
        return new Promise((resolve, reject) => {
            this.stream.write(content + '\n', error => error ? reject(error) : resolve());
        });
    }
    close() {
        debug('close');
        if (this.stream === process.stdout || this.stream === process.stderr) {
            return this;
        }
        return new Promise((resolve) => {
            this.stream.end(resolve);
        });
    }
}

module.exports = Output;
