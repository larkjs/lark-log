/**
 * Lark Logger
 **/
'use strict';

const assert  = require('assert');
const debug   = require('debug')('lark-log.Logger');
const events  = require('events');
const extend  = require('extend');
const format  = require('dateformat');
const fs      = require('fs');
const misc    = require('vi-misc');
const mkdirp  = require('mkdirp');
const path    = require('path');

const Output        = require('./Output');
const defaultConfig = require('../config/default');

class Logger extends events.EventEmitter {

    constructor(options = {}) {
        debug('construct');
        super();

        this.o = {
            date: (str) => format(Date.now(), str),
        };

        this.config = extend(true, {}, defaultConfig);
        this.outputs = {};
        this.configure(options);
    }

    configure(options = {}) {
        debug('configure');
        assert(options instanceof Object, 'Options must be an object');
        options = extend(true, {}, options);
        if (options.inherit === false) {
            this.config = {};
        }
        delete options.inherit;
        this.config = extend(true, this.config, options);
        this.config.path = misc.path.absolute(this.config.path || '');

        this.close();
        this._defineOutputs();
        this._defineMethods();

        return this;
    }

    _defineOutputs() {
        debug('define outputs');
        if (!this.config || !(this.config.outputs instanceof Object)) {
            return;
        }
        for (const name in this.config.outputs) {
            const config = this.config.outputs[name];
            if (!config) {
                continue;
            }
            assert(config instanceof Object, `Output ${name} should be an object`);
            config.type = config.type || this.config.defaultType || 'stdout';
            config.type = config.type.toLowerCase();

            let outputStream = null;
            let filepath = null;
            switch (config.type) {
            case 'stderr':
                outputStream = process.stderr; 
                break;
            case 'file':
                assert('string' === typeof config.path, 'Output.path should be a string');
                filepath = path.isAbsolute(config.path) ? config.path : path.join(this.config.path, config.path);
                mkdirp.sync(path.dirname(filepath));
                outputStream = fs.createWriteStream(filepath, config.stream || { flags: 'a' });
                break;
            case 'stdout':
            default:
                outputStream = process.stdout;
                break;
            }
            this.outputs[name] = new Output(outputStream, config);
        }
    }

    _defineMethods() {
        debug('define methods');
        const outputs = Object.keys(this.outputs);

        for (const method in this.config.methods) {
            assert(!Logger.prototype.hasOwnProperty(method), 'Can not overwrite reserved method!');
            const config = this.config.methods[method];
            assert(outputs.includes(config.output), `Can not found output ${config.output}`);
            config.level = Math.max(1, parseInt(config.level) || 1);
            assert(!Number.isNaN(config.level), 'Log level must be a number');
            if (config.level < this.config.level) {
                this[method] = doNothing;
                continue;
            }

            const output = this.outputs[config.output];
            const METHOD = method.toUpperCase();

            this[method] = (content) => {
                debug(`log [${method}]`);
                const info = extend(true, {}, this.o, config, { method: METHOD, content: content });
                return output.output(info).catch(error => this.emit('error', error));
            };
        }

        return this;
    }

    close () {
        for (const method in this) {
            if (this[method] instanceof Function && !Logger.prototype[method]) {
                delete this[method];
            }
        }

        for (const name in this.outputs) {
            this.outputs[name].close();
        }

        this.outputs = {};
        
        return this;
    }

}

function doNothing() {}

module.exports = Logger;
