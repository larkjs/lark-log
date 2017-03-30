/**
 * class Logger, used to print logs
 **/
'use strict';

/**
 * Import public modules
 **/
const $         = require('lodash');
const assert    = require('assert');
const extend    = require('extend');
const fs        = require('fs');
const misc      = require('vi-misc');
const mkdirp    = require('mkdirp');
const path      = require('path');

/**
 * Import internal modules
 **/
const Output    = require('./Output');
const defaultConfig = require('../config/default');

class Logger {
    constructor (options = {}) {
        this.o = {
            date: misc.time.format
        };

        this.enable = true;
        this.config = $.cloneDeep(defaultConfig);
        this.outputs = {};
        this.configure(options);
    }
    configure (options = {}) {
        assert(options instanceof Object, 'Options passed should be an object');
        options = $.cloneDeep(options);

        this.config = (false === options.inherit) ? {} : this.config;

        delete options.inherit;
        this.config = extend(true, this.config, $.cloneDeep(options));
        assert(this.config instanceof Object, 'Internal Error');

        this.config.path = misc.path.absolute(this.config.path || 'logs');

        this.clear();
        this.defineOutputs();
        this.defineMethods();
        return this;
    }
    /**
     * Clear all logging methods and close all logging streams for this instance
     **/
    clear () {
        for (let method in this) {
            if (this[method] instanceof Function && !Logger.prototype[method]) {
                delete this[method];
            }
        }

        for (let name in this.outputs) {
            this.outputs[name].close();
        }

        this.outputs = {};
        
        return this;
    }
    /**
     * Close this logger
     **/
    close () {
        for (let name in this.outputs) {
            const output = this.outputs[name];
            output.close();
        }
        return this.clear();
    }
    /**
     * Defining the logging outputs
     **/
    defineOutputs () {
        assert(this.config instanceof Object, 'Internal Error! Missing config for this logger instance');
        this.config.outputs = this.config.outputs || {};
        assert(this.config.outputs instanceof Object, 'You should define ouputs for this logger instance');

        for (let output in this.config.outputs) {

            let config = $.cloneDeep(this.config.outputs[output] || {});
            assert(config instanceof Object, 'Output config must be an object');
            config.type = config.type || this.config.defaultType || 'stdout';
            assert('string' === typeof config.type, 'Output type must be a string');
            config.type = config.type.toLowerCase();

            let outputStream = process.stdout;
            let filepath = null;

            switch (config.type.toLowerCase()) {
            case 'stdout':
                outputStream = process.stdout;
                break;
            case 'stderr':
                outputStream = process.stderr;
                break;
            case 'file':
                assert('string' === typeof config.path, 'Output path must be a string');
                filepath = path.isAbsolute(config.path) ?
                    config.path : path.join(this.config.path, config.path);
                assert(path.isAbsolute(filepath), 'File path for logging should be an absolute path');
                mkdirp.sync(path.dirname(filepath));
                outputStream = fs.createWriteStream(filepath, config.stream || { flags: 'a' });
                break;
            default:
                outputStream = process.stdout;
                break;
            }

            this.outputs[output] = new Output(outputStream, config);
        }
    }
    /**
     * Defining the logging methods
     **/
    defineMethods () {

        assert(this.config instanceof Object, 'Internal Error! Missing config for this logger instance');
        this.config.methods = this.config.methods || {};
        assert(this.config.methods instanceof Object, 'You should define methods for this logger instance');

        for (let method in this.config.methods) {
            assert(!Logger.prototype.hasOwnProperty(method), 'Can not overwrite reserved method!');
            this[method] = (content) => {
                let config = $.cloneDeep(this.config.methods[method]);
                assert(config instanceof Object, 'Config for method must be an object');

                config.level = Math.max(1, parseInt(config.level) || 1);
                assert(!Number.isNaN(config.level), 'Log level must be a number');
                if (config.level < this.config.level) {
                    return;
                }

                let output = this.outputs[config.output];
                if (!(output instanceof Output)) {
                    throw new Error('Output printer not found!');
                }

                let info = config;
                info = extend(true, this.o, info);
                info.method = method.toUpperCase();
                info.content = content;
                return output.output(info);
            };
        }

    }
}

module.exports = Logger;
