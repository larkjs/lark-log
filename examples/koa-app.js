/**
 * Example of using Lark-log in Koa-app
 **/
'use strict';

import _debug   from 'debug';
import Log 		from '..';
import log      from '../middleware';
import Koa      from 'Koa';

const debug = _debug("lark-log");

debug("Example: set main module to this module for test");
process.mainModule = module;

const app   = new Koa();

app.use(log());
app.use(async (ctx, next) => {
	debug("Example: print log with context");
    ctx.logger.notice('This is log');
    debug("Example: print log without context");
    Log.instance().notice('This is log 2');
    await next();
});

app.listen(3000, () => {
    console.log("Koa app listening at 3000...");
});
