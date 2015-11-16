/**
 * Logging
 **/
'use strict';

import _debug   from 'debug';
import caller   from 'caller';
import extend   from 'extend';
import path     from 'path';
import BaseOutput     from './lib/BaseOutput';
import ConsoleOutput  from './lib/ConsoleOutput';
import FileStreamOutput   from './lib/FileStreamOutput';
import defaultConfig  from './config/default';

const debug = _debug("lark-log");

class Logger {
    constructor (options) {
        debug("Logger: constructing");
        this.config = extend(true, {}, defaultConfig);
        if ('string' !== typeof this.config.root) {
            this.config.root = caller();
        }
        this.configure(options);
        debug("Logger: constructing ok");
    }
    configure (options) {
        debug("Logger: configure start");
        if (options instanceof Object) {
            debug("Logger: using options");
            if (options.default === false) {
                debug("Logger: removing default configs by options");
                delete options.default;
                this.config = {};
            }
            this.config = extend(true, this.config, options);
        }
        if ('string' !== typeof this.config.root) {
            this.config.root = caller();
        }
        this.defineMethods();
        return this;
    }
    clear () {
        debug("Logger: clearing all methods generated last time when defineMethods was called");
        for (let method in this) {
            if (this[method] instanceof Function && !Logger.prototype[method]) {
                delete this[method];
            }
        }

        debug("Logger: clearing output logger");
        for (let output in this.outputs || {} ) {
            this.outputs[output].close();
        }

        this.outputs = {};
        
        return this;
    }
    close () {
        debug("Logger: closing");
        this.clear();
        delete this.config;
        return this;
    }
    defineMethods () {
        debug("Logger: define methods by config");

        if (!(this.config.methods instanceof Object) || !(this.config.outputs instanceof Object)) {
            console.warn("Config.methods/outputs must be an object, abort to define logger methods");
            return this;
        }

        this.clear();

        debug("Logger: add output logger");
        for (let output in this.config.outputs) {
            let config = this.config.outputs[output] || {};
            if (!(config instanceof Object)) {
                throw new Error("Config.outputs must be an object");
            }
            if (!config.type || 'string' !== typeof config.type) {
                config.type = '';
            }
            let outputPrinter = null;
            switch (config.type.toLowerCase()) {
                case 'console':
                    outputPrinter = new ConsoleOutput(config);
                    break;
                case 'stream':
                default:
                    config.type = 'filestream';
                    if (!path.isAbsolute(config.path)) {
                        debug("Logger: change relative path to absolute path");
                        config.path = path.join(path.dirname(this.config.root), config.path);
                    }
                    outputPrinter = new FileStreamOutput(config);
                    break;
            }
            debug("Logger: add output printer " + output + ' as a ' + config.type + ' printer');
            this.outputs[output] = outputPrinter;
        }

        debug("Logger: add methods by config");
        for (let method in this.config.methods) {
            let config = extend(true, {}, this.config.methods[method]);
            let output = this.outputs[config.output];
            if (!(output instanceof BaseOutput)) {
                throw new Error("Output printer not found!");
            }
            this[method] = (content) => {
                debug("Logger: method " + method + " is called");
                if (config.level < this.config.level) {
                    debug("Logger: method " + method + " low level, abort printing logs");
                    return;
                }
                output.print(content, method);
                return this;
            };
        }

        debug("Logger: define methods done");
    }
}

export default Logger;

debug("Logger: load ok");
