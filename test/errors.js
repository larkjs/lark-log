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
        let error = {};
        try {
            const logger = new LarkLog({
                outputs: {
                    system: {
                        format: "<% something wrong here %>",
                    }
                }
            });
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceOf(Error);
    });

    it('should throw if path format is not valid', async () => {
        let error = {};
        try {
            const logger = new LarkLog({
                outputs: {
                    system: {
                        path:  "<% something wrong here %>",
                    }
                }
            });
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceOf(Error);
    });
});
