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
        /* disabled by default;
        'logPathFormat' : '{{name}}.{{split}}.log',
        'splitFormat' : 'yyyymmdd',
        */
        'format': '{{method}}: {{datetime}} {{message}}',
        'maxLength': 2000,
    },
    'info': {
        'root': './logs',
        'name': 'app',
        /* disabled by default;
        'logPathFormat' : '{{name}}.info.{{split}}.log',
        'splitFormat' : 'yyyymmdd',
        */
        'methods' : ['info', 'notice', 'warn'],
        'format': '{{method}}: {{datetime}} {{message}}',
        'maxLength': 2000,
    },
    'sys': {
        'root': './logs',
        'name': 'app',
        'method': ['error', 'fatal'],
        /* disabled by default;
        'logPathFormat' : '{{name}}.{{split}}.log.wf',
        'splitFormat' : 'yyyymmdd',
        */
        //'format': '{{datetime}} {{file}}:{{line}} {{message}}',
        'format': '{{method}}: {{datetime}} {{message}}',
        'maxLength': 2000,
        /* disabled by default
        'preprocess': function (message, method, oriArgs) {
            message.logid =  oriArgs[1] || 0;
        }
        */
    }
}

module.exports = config
