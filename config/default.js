/**
 * The default config of loggers
 **/
'use strict';

module.exports = {
    path: "logs",
    defaultType: 'file',
    level: 1,
    methods: {
        debug: {
            level: 1,
            output: 'console',
        },
        log: {
            level: 2,
            output: 'console',
        },
        trace: {
            level: 2,
            output: 'console',
        },
        notice: {
            level: 3,
            output: 'system',
        },
        warn: {
            level: 4,
            output: 'system',
        },
        error: {
            level: 5,
            output: 'error',
        },
        fatal: {
            level: 5,
            output: 'error',
        },
    },
    outputs: {
        console: {
            type: 'stdout',
            format: '<%- method %>:\t<%- date("yyyy-mm-dd HH:MM:ss")%>\t<%- content %>',
            maxLength: 10000,
        },
        system: {
            path: 'system.log',
            format: '<%- method %>:\t<%- date("yyyy-mm-dd HH:MM:ss")%>\t<%- content %>',
            maxLength: 10000,
        },
        error: {
            path: 'error.log',
            format: '<%- method %>:\t<%- date("yyyy-mm-dd HH:MM:ss")%>\t<%- content %>',
            maxLength: 10000,
        },
    }
};
