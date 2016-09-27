/**
 * class Logger, used to print logs
 **/
'use strict';

/**
 * Import public modules
 **/
const $         = require('lodash');
const debug     = require('debug')('lark-log.Logger');
const assert    = require('assert');
const extend    = require('extend');
const fs        = require('fs');
const mkdirp    = require('mkdirp');
const path      = require('path');
const instances = require('save-instance');

/**
 * Import internal modules
 **/
const Output    = require('./Output');
const defaultConfig = require('../config/default');

debug('loading ...');

class Logger {
    constructor (options = {}) {
        debug("constructor() called, initializing object ...");
        this.enable = true;
        this.outputs = {};
        this.configure(options);
        debug("contstuctor() configured");
    }
    configure (options = {}) {
        debug("configure() called, configuring ...");
        assert(options instanceof Object, "Options passed should be an object");
        options = $.cloneDeep(options);

        if (!this.config) {
            debug("configure() initializing configs");
            this.config = (false === options.default) ? {} : $.cloneDeep(defaultConfig);
        }
        delete options.default;
        this.config = extend(true, this.config, $.cloneDeep(options));
        assert(this.config instanceof Object, "Internal Error");

        /**
         * Make sure this.congif.path is the absolute path log directory
         **/
        const dirname = path.dirname(process.mainModule.filename);
        this.config.path = this.config.path || dirname;
        this.config.path = path.normalize(this.config.path);
        if (!path.isAbsolute(this.config.path)) {
            this.config.path = path.join(dirname, this.config.path);
        }

        this.clear();
        this.defineOutputs();
        this.defineMethods();
        return this;
    }
    /**
     * Clear all logging methods and close all logging streams for this instance
     **/
    clear () {
        debug("clear() clearing all methods generated for this instance");
        for (let method in this) {
            if (this[method] instanceof Function && !Logger.prototype[method]) {
                delete this[method];
            }
        }

        debug("clear() clearing output logger");
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
        debug("Logger.defineOutputs() called, defining outputs by config ...");

        assert(this.config instanceof Object, "Internal Error! Missing config for this logger instance");
        this.config.outputs = this.config.outputs || {};
        assert(this.config.outputs instanceof Object, "You should define ouputs for this logger instance");

        debug("Logger.defineOutputs() add output streams");
        for (let output in this.config.outputs) {

            let config = $.cloneDeep(this.config.outputs[output] || {});
            assert(config instanceof Object, "Output config must be an object");
            config.type = config.type || this.config.defaultType || 'stdout';
            assert('string' === typeof config.type, "Output type must be a string");
            config.type = config.type.toLowerCase();

            let outputStream = process.stdout;

            switch (config.type.toLowerCase()) {
                case 'stdout':
                    outputStream = process.stdout;
                    debug('Logger.defineOutputs() using stdout');
                    break;
                case 'stderr':
                    outputStream = process.stderr;
                    debug('Logger.defineOutputs() using stderr');
                    break;
                case 'file':
                    let filepath = path.isAbsolute(config.path) ? config.path : path.join(this.config.path, config.path);
                    assert(path.isAbsolute(filepath), 'File path for logging should be an absolute path');
                    mkdirp.sync(path.dirname(filepath));
                    outputStream = fs.createWriteStream(filepath, config.stream || { flags: 'a' });
                    debug('Logger.defineOutputs() using file stream');
                    break;
                default:
                    outputStream = process.stdout;
                    debug('Logger.defineOutputs() using stdout as default');
                    break;
            }

            this.outputs[output] = new Output(outputStream, config);
            debug('Logger.defineOutputs() done for "' + output + '"');
        }
    }
    /**
     * Defining the logging methods
     **/
    defineMethods () {
        debug("Logger.defineMethods() called, defining methods by config ...");

        assert(this.config instanceof Object, "Internal Error! Missing config for this logger instance");
        this.config.methods = this.config.methods || {};
        assert(this.config.methods instanceof Object, "You should define methods for this logger instance");

        debug("Logger.defineMethods() add methods by config");
        for (let method in this.config.methods) {
            assert(!Logger.prototype.hasOwnProperty(method), 'Can not overwrite reserved method!');
            this[method] = (content) => {
                let config = $.cloneDeep(this.config.methods[method]);
                assert(config instanceof Object, 'Config for method must be an object');

                debug("Logger.method: " + method + "() is called ...");
                config.level = Math.max(1, parseInt(config.level) || 1);
                assert(!Number.isNaN(config.level), 'Log level must be a number');
                if (config.level < this.config.level) {
                    debug("Logger.method: method " + method + " low level, abort printing logs");
                    return;
                }

                let output = this.outputs[config.output];
                if (!(output instanceof Output)) {
                    throw new Error("Output printer not found!");
                }

                let info = config;
                info.method = method.toUpperCase();
                info.content = content;
                return output.output(info);
            };
            debug('Logger.method: done for "' + method + '"');
        }

        debug("Logger.method: define methods done");
    }
}
instances(Logger);

debug("loaded!");
module.exports = Logger;
