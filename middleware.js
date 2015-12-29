/**
 * Lark-log middleware
 **/

'use strict';

import _debug from 'debug';
import caller from 'caller';
import path   from 'path';
import Log    from './';

const debug = _debug("lark-log");

function middleware (options = {}) {
    debug("Middleware: create middleware");
    const logger = new Log(options).saveInstance();
    return async (ctx, next) => {
        debug("Middleware: ctx.log enabled!");
        const starttime = Date.now();
        const logid = ctx.state.logid || genLogid();
        ctx.logger = logger;
        debug("Middleware: ctx.log on request");
        ctx.logger.request({
            logid: logid,
            method: ctx.method,
            url: ctx.url,
            headers: ctx.headers,
        });
        await next();
        debug("Middleware: ctx.log on response");
        ctx.logger.response({
            logid: logid,
            status: ctx.status,
            cost: Date.now() - starttime,
        });
    }
}

function genLogid () {
    return Date.now() + '' + Math.floor(Math.random() * 1000);
}

debug("Middleware: load!");
export default middleware;
