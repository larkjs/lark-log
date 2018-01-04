/**
 * Test/Example for the log rotate case
 **/
'use strict';

process.mainModule  = module;
const dateformat    = require('dateformat');
const fs            = require('fs');
const misc          = require('vi-misc');
const should        = require('should');
const LarkLog       = require('lark-log');
misc.async.all(fs);


describe('print logs with log rotate enabled', () => {
    let logger = {};

    it('should be ok creating a new LarkLog with custom configs', async () => {
        logger = new LarkLog({
            outputs: {
                default: {
                    'path-suffix': '.log.<%= date("yyyymmddHHMMss") %>'
                }
            }
        });
        logger.useDefaultConfig();
    });

    it('should print logs into different log file', async () => {
        const timestamp1 = dateformat("yyyymmddHHMMss");
        logger.notice('NOTICE 1');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const timestamp2 = dateformat("yyyymmddHHMMss");
        logger.notice('NOTICE 2');
        let notice1 = await fs.readFileAsync(misc.path.absolute('./logs/system.log.' + timestamp1));
        let notice2 = await fs.readFileAsync(misc.path.absolute('./logs/system.log.' + timestamp2));
        let noticeMessage1 = notice1.toString().split('\n').filter(line => !!line).pop();
        let noticeMessage2 = notice2.toString().split('\n').filter(line => !!line).pop();
        should(noticeMessage1.match(/^NOTICE:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+NOTICE 1$/)).be.ok;
        should(noticeMessage2.match(/^NOTICE:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+NOTICE 2$/)).be.ok;
    });
});
