'use strict';

const util = require('util');
const StreamLogger = require('./StreamLogger');
const ConsoleLogger = require('./ConsoleLogger');

// Export this class
class Logger {
    constructor (conf) {
        this.conf = conf || {};
        this.configure();
    }
    /**
     * configure method
     */
    configure (conf) {
        conf = conf || {};
        this.conf = util._extend(this.conf, conf);
        let loggers = this._get_loggers();
        if (!Array.isArray(loggers)) {
            throw new Error("Loggers should be an array!");
        }
        loggers.forEach((name) => {
            let conf = this.conf[name]
            if (!conf) {
                return;
            }
            let logger = this[name + '_logger']
            if (logger instanceof StreamLogger) {
                this[name + '_logger'].configure(conf)
            }
            else {
                this[name + '_logger'] = logger = name === 'console' ? new ConsoleLogger(conf) : new StreamLogger(conf);
            }
            if (conf.methods || conf.method) {
                addMethods(conf.methods || conf.method, logger);
            }
        })
        return this
    }
    _get_loggers () {
        // Default Loggers
        let loggers = ['console', 'daily', 'info', 'sys'];

        let customLoggers = this.conf.loggers || [];
        customLoggers = Array.isArray(customLoggers) ? customLoggers : [customLoggers];
        customLoggers.forEach((logger) => {
            if (loggers.indexOf(logger) < 0) {
                loggers.push(logger);
            }
        });
        return loggers;
    }
};
module.exports = Logger;

function addMethods(methods, logger) {
    if ('string' === typeof methods) {
        methods = [methods];
    }
    if (!Array.isArray(methods)) {
        throw new Error('Methods of lark log config must be a string or an array');
    }
    methods.forEach((method) => {
        if ('string' !== typeof method) {
            throw new Error('Each method in lark log config must be a string');
        }
        Logger.prototype[method] = ((method, logger) => {
            // Don't use arrow function here, since `this` in this function
            // should refer to the instance
            return function (message) {
                if (this.conf.level > this.conf.logLevel[method]) {
                    return this;
                }
                if (logger.conf && logger.conf.preprocess instanceof Function) {
                    message = logger.conf.preprocess(message, method, arguments) || message;
                }
                logger.write(message, method);
                return this;
            };
        })(method, logger);
    });
};
