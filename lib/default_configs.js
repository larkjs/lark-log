var colors = require('colors')
var config  = {
    'console': {
        'methods': [ 'log', 'trace', 'debug'],
        'filters': {
            'log': [colors.green, colors.bold],
            'trace': [colors.red, colors.bold],
            'debug': [colors.blue, colors.bold],
        },
    },
    'daily': {
        'root': './logs',
        'prefix': 'app',
        'log_type': 'daily',
        'logPathFormat' : '{{root}}/{{prefix}}.{{date}}.log',
        'splitFormat' : 'yyyymmdd',
        'methods' : ['perform', 'request'],
        'format': '{{logid}} {{timestamp}} ({{method}}) {{message}}'
    },
    'notice': {
        'root': './logs',
        'prefix': 'app',
        'log_type': 'notice',
        'logPathFormat' : '{{root}}/{{prefix}}.{{date}}.{{log_type}}.log',
        'splitFormat' : 'yyyymmdd',
        'talkwith': 'unknow',
        'methods' : ['info', 'notice', 'warn'],
        'format': ['{{logid}} {{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}', {
            'notice': '{{logid}} {{timestamp}} talkwith:{{talkwith}} {{file}}:{{line}} ({{method}}) {{message}}'
        }]
    },
    'sys': {
        'root': './logs',
        'name': 'error',
        'log_type': 'error',
        'method': ['error', 'fatal'],
        'logPathFormat' : '{{root}}/{{name}}.{{log_type}}.log',
        'format': '{{logid}} {{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}'
    }
}

module.exports = config
