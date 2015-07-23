'use strict';
var util = require('util')
var StreamLogger = require('./StreamLogger')
var ConsoleLogger = require('./ConsoleLogger')

var Logger = function(conf) {
    this.conf = conf || {}
    return this.configure();
}

util._extend( Logger.prototype, {
    /**
     * configure method
     */
    'configure': function(conf) {
        var me = this;
        this.conf = util._extend(this.conf, conf);
        var loggers = this._get_loggers();
        loggers.forEach(function(name){
            var conf = me.conf[name]
            if (!conf) {
                return;
            }
            var logger = me[name + '_logger']
            if (logger instanceof StreamLogger) {
                me[name + '_logger'].configure(conf)
            }
            else {
                me[name + '_logger'] = logger = name === 'console' ? new ConsoleLogger(conf) : new StreamLogger(conf);
            }
            if (conf.methods || conf.method) {
                addMethods(conf.methods || conf.method, logger);
            }
        })
        return this
    },
    '_get_loggers': function () {
        // Default Loggers
        var loggers = ['console', 'daily', 'info', 'sys'];

        var customLoggers = this.conf.loggers || [];
        customLoggers = Array.isArray(customLoggers) ? customLoggers : [customLoggers];
        customLoggers.forEach(function (logger) {
            if (loggers.indexOf(logger) < 0) {
                loggers.push(logger);
            }
        });
        return loggers;
    }
});

function addMethods(methods, logger) {
    if ('string' === typeof methods) {
        methods = [methods];
    }
    if (!Array.isArray(methods)) {
        throw new Error('Methods of lark log config must be a string or an array');
    }
    methods.forEach(function (method) {
        if ('string' !== typeof method) {
            throw new Error('Each method in lark log config must be a string');
        }
        Logger.prototype[method] = (function (method, logger) {
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

module.exports = Logger
