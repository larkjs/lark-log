'use strict';
var configure = require('./lib/configure')

module.exports = {
    /*
     * Generate logger with default setting.
     *
     *     >>> var logger = require('lark-log').logger
     *
     */
    'logger': configure(), 
    /*
     * Generate log middleware for app.
     *
     *     >>> app.use(require('lark-log').middleware(conf))
     *
     */
    'middleware': require('./middleware'),
    /* Generate custom logger by chain calling.
     *
     *     >>> conf.logid = this.request.logid
     *     >>> var logger = require('lark-log').configure(conf).logger
     */
    'configure': configure,
    /* Generate logid for debugging
     *
     *     >>> var logid = require('lark-log').get_logid()
     */
    'get_logid': require('./lib/logid') 
}


