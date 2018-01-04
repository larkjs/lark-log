/**
 * Errors for lark-log
 **/
'use strict';

process.mainModule  = module;
const misc          = require('vi-misc');
const should        = require('should');
const LarkLog       = require('lark-log');


describe('print log with wrong config', () => {
    it('should throw if format is not valid', async () => {
        let error = await misc.async.catchError((async () => {
            const logger = new LarkLog({
                outputs: {
                    system: {
                        format: "<% 'forget to close the bracket ",
                    }
                }
            });
            logger.notice("Hello");
        })());
        should(error).be.an.instanceOf(Error);
    });

    it('should throw if path format is not valid', async () => {
        let error = await misc.async.catchError((async () => {
            const logger = new LarkLog({
                outputs: {
                    system: {
                        path:  "<% 'forget to close the bracket ",
                    }
                }
            });
            logger.notice("Hello");
        })());
        should(error).be.an.instanceOf(Error);
    });
});
