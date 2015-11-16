/**
 * The default config of loggers
 **/
'use strict';

export default {
    level: 1,
    methods: {
        debug: {
            level: 1,
            output: 'console',
        },
        log: {
            level: 1,
            output: 'console',
        },
        trace: {
            level: 2,
            output: 'console',
        },
        notice: {
            level: 3,
            output: 'info',
        },
        info: {
            level: 3,
            output: 'info',
        },
        request: {
            level: 3,
            output: 'access',
        },
        perform: {
            level: 3,
            output: 'access',
        },
        warn: {
            level: 4,
            output: 'sys',
        },
        error: {
            level: 5,
            output: 'sys',
        },
        fatal: {
            level: 5,
            output: 'sys',
        },
    },
    outputs: {
        console: {
            type: 'console',        
            format: '<%- method %>: <%- new Date %> <%- content %>',
            maxLength: 2000,
        },
        access: {
            path: 'logs/access.<%- datetime("yyyyMMddhh") %>.log',
            format: '<%- method %>: <%- new Date %> <%- content %>',
            maxLength: 2000,
        },
        info: {
            path: 'logs/app.log',
            format: '<%- method %>: <%- new Date %> <%- content %>',
            maxLength: 2000,
        },
        sys: {
            path: 'logs/app.log.wf',
            format: '<%- method %>: <%- new Date %> <%- content %>',
            maxLength: 2000,
        },
    }
};
