'use strict';
var util = require('util')
var StreamLogger = require('./StreamLogger')
var ConsoleLogger = require('./ConsoleLogger')

var Logger = function(conf) {
    this.conf = conf || {}
    this.console_logger = new ConsoleLogger(this.conf.console)
    this.daily_logger = new StreamLogger(this.conf.daily)
    this.info_logger = new StreamLogger(this.conf.info)
    this.sys_logger = new StreamLogger(this.conf.sys)
}

util._extend( Logger.prototype, {
    'configure': function(conf) {
        var me = this
        this.conf = util._extend(this.conf, conf);
        ['console', 'daily', 'notice', 'sys'].forEach(function(name){
            var conf = me.conf[name]
            var logger = me[name + '_logger']
            if ( conf && logger && logger.configure) {
                me[name + '_logger'].configure(me.conf[name])
            }
        })
        return this
    },
});

['log', 'trace', 'debug'].forEach(function(method) {
    Logger.prototype[method] = function(message){
        if (this.conf.level > this.conf.logLevel[method]) {
            return;
        }
        this.console_logger.write(message, method)
    }
});

['request', 'perform'].forEach(function(method) {
    Logger.prototype[method] = function(message){
        if (this.conf.level > this.conf.logLevel[method]) {
            return;
        }
        this.daily_logger.write(message, method)
    }
});

['info', 'notice', 'warn'].forEach(function(method) {
    Logger.prototype[method] = function(message){
        if (this.conf.level > this.conf.logLevel[method]) {
            return;
        }
        this.info_logger.write(message, method)
    }
});

['error', 'fatal'].forEach(function(method) {
    Logger.prototype[method] = function(message){
        if (this.conf.level > this.conf.logLevel[method]) {
            return;
        }
        this.sys_logger.write(message, method)
    }
});

module.exports = Logger
