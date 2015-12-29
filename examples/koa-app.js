/**
 * Example of using Lark-log in Koa-app
 **/
'use strict';

import _debug   from 'debug';
import log      from '../middleware';
import Koa      from 'Koa';

const debug = _debug("lark-log");

const app   = new Koa();

app.use(log());
app.use(async (ctx, next) => {
    ctx.logger.notice('This is log');
    await next();
});

app.listen(3000, () => {
    console.log("Koa app listening at 3000...");
});
