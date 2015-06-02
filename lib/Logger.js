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
        ['console', 'daily', 'info', 'sys'].forEach(function(name){
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
        Logger.prototype[method] = (function () {
            return function (message) {
                if (this.conf.level > this.conf.logLevel[method]) {
                    return this;
                }
                logger.write(message, method);
                return this;
            };
        })(method, logger);
    });
};

module.exports = Logger
