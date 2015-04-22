'use strict';
var util = require('util')
var logger = require('tracer')
var default_configs = require('./default_configs')

function configure(config) {
    config = util._extend(default_configs, config)

    var console_logger = logger.colorConsole(config.console)
    var daily_logger = logger.dailyfile(config.daily)
    var notice_logger = logger.dailyfile(config.notice)
    var sys_logger = logger.dailyfile(config.sys)

    return {
        'log': console_logger.log,
        'trace': console_logger.trace,
        'debug': console_logger.debug,
        'info': notice_logger.info,
        'notice': notice_logger.notice,
        'warn': notice_logger.warn,
        'request': daily_logger.request,
        'perform': daily_logger.perform,
        'error': sys_logger.error,
        'fatal': sys_logger.fatal,
    }
}

module.exports = configure;
