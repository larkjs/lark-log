'use strict';
var config  = {
    /**
     * logger configure
     */
    'level': 3,
    'logLevel': {
        'debug': 1,
        'log': 1,
        'trace': 2,
        'notice': 3,
        'info': 3,
        'perform': 3,
        'request': 3,
        'warn': 4,
        'error': 5,
        'fatal': 5
    },
    /**
     * sub logger configure
     */
    'console': {
        'methods': [ 'log', 'trace', 'debug'],
    },
    'daily': {
        'root': './logs',
        'name': 'app',
        'log_type': 'daily',
        'methods' : ['perform', 'request'],
        'format': '{{method}}: {{datetime}} {{message}}',
        'maxLength': 2000,
    },
    'info': {
        'root': './logs',
        'name': 'app.info',
        'logPathFormat' : '{{root}}/{{prefix}}.{{date}}.log',
        'splitFormat' : 'yyyymmdd',
        'methods' : ['info', 'notice', 'warn'],
        'format': '{{method}}: {{datetime}} {{message}}',
        'maxLength': 2000,
    },
    'sys': {
        'root': './logs',
        'name': 'app.sys',
        'method': ['error', 'fatal'],
        'logPathFormat' : '{{root}}/{{prefix}}.log',
        //'format': '{{datetime}} {{file}}:{{line}} {{message}}',
        'format': '{{method}}: {{datetime}} {{message}}',
        'preprocess' :  function(data){
            data.logid = data.args.logid || 0;
        },
        'maxLength': 2000,
    }
}

module.exports = config
