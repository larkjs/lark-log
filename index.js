'use strict';
//@TODO ingerated talkwith in http
//@TODO print line no in sys log
var Logger = require('./lib/Logger')
var default_config = require('./conf/defaults')
var logging = global.larkLog = (typeof(global.larkLog) == "object") ?
    global.larkLog: new Logger(default_config) // Set lark-log as a gloabal variable to facilatate using.

module.exports = {
    /*
     * Provide well defined logger to user.
     *     >>> var loggging = require('lark-log').logging
     *     >>> logging.info('message')
     */
    'logging': logging, 
    /*
     * logging middleware for lark/koa app.
     *
     *     >>> app.use(require('lark-log').middleware(conf))
     *
     */
    'middleware': require('./lib/middleware')(logging),
}
