'use strict';
var debug = require('debug')('log')
var util = require('util')
var fs = require('fs')
var logger = require('tracer')
var default_configs = require('./default_configs')

function makeDir(path){
    if (!path) return;
    try {
        var stats = fs.statSync(path)
        if (stats.isDirectory()){
            return;
        }else{
            throw "log root path need to be a dir."
        }
    } catch(e) {
        if (e && e.code == "ENOENT"){
            fs.mkdirSync(path)
            return;
        }else{
            throw e
        }
    }
    
}

function configure(config) {
    config = util._extend(default_configs, config)
    
    makeDir(config.console.root)
    var console_logger = logger.colorConsole(config.console)
    makeDir(config.daily.root)
    var daily_logger = logger.dailyfile(config.daily)
    makeDir(config.notice.root)
    var notice_logger = logger.dailyfile(config.notice)
    makeDir(config.sys.root)
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
