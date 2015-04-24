'use strict';
var debug = require('debug')('log')
var ROOT_PATH = './logs'
var config  = {
    'console': {
        'methods': [ 'log', 'trace', 'debug'],
    },
    'daily': {
        'root': './logs',
        'prefix': 'app',
        'log_type': 'daily',
        'logPathFormat' : '{{root}}/{{prefix}}.{{date}}.log',
        'splitFormat' : 'yyyymmdd',
        'methods' : ['perform', 'request'],
        'format': '{{logid}} {{timestamp}} ({{method}}) {{message}}',
        'preprocess' :  function(data){
            data.logid = data.args.logid || 0;
        },
    },
    'notice': {
        'root': './logs',
        'prefix': 'app.notice',
        'logPathFormat' : '{{root}}/{{prefix}}.{{date}}.log',
        'splitFormat' : 'yyyymmdd',
        'methods' : ['info', 'notice', 'warn'],
        'format': ['{{logid}} {{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}', {
            'notice': '{{logid}} {{timestamp}} talkwith:{{talkwith}} {{file}}:{{line}} ({{method}}) {{message}}'
        }],
        'preprocess' :  function(data){
            data.logid = data.args.logid || 0;
            data.talkwith = data.args.talkwith || 'unknow'
        },
    },
    'sys': {
        'root': './logs',
        'prefix': 'app.error',
        'method': ['error', 'fatal'],
        'logPathFormat' : '{{root}}/{{prefix}}.log',
        'format': '{{logid}} {{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}',
        'preprocess' :  function(data){
            data.logid = data.args.logid || 0;
        },
    }
}

module.exports = config
