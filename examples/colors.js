/**
 * lark-log - example.js
 * Copyright(c) 2014 mdemo(https://github.com/demohi)
 * MIT Licensed
 */

'use strict';

var log = require('../');
var colors = require('colors');

var config = {
    dateformat : "HH:MM:ss.L",
    files: {
        debug: {
            path: 'debug.log',
            options:{
                encoding: 'utf8'
            }
        },
        info: {
            path: 'info.log'
        },
        error: {

        }
    },
    filters : {
        error : [ colors.red, colors.bold ]
    }
};
var logger = log(config);

logger.info('info' + Date.now());
logger.debug('debug' + Date.now());
logger.debug('debug' + Date.now());
logger.error('error' + Date.now());

