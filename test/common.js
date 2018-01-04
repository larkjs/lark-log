/**
 * Test/Example for common uses for lark-log
 **/
'use strict';

process.mainModule  = module;
const fs            = require('fs');
const intercept     = require('intercept-stdout');
const misc          = require('vi-misc');
const should        = require('should');
const LarkLog       = require('lark-log');
misc.async.all(fs);


describe('create a new instance of lark log with default configs', () => {
    let logger = {};

    it('should be ok creating a new LarkLog with default configs', async () => {
        logger = new LarkLog();
        logger.useDefaultConfig();
    });

    it('should print loggs into the right file', async () => {
        await logger.notice("THIS IS NOTICE");
        await logger.error("THIS IS ERROR");
        let notice = await fs.readFileAsync(misc.path.absolute('./logs/system.log'));
        let error = await fs.readFileAsync(misc.path.absolute('./logs/system.log.wf'));
        let noticeMessage = notice.toString().split('\n').filter(line => !!line).pop();
        let errorMessage = error.toString().split('\n').filter(line => !!line).pop();
        should(noticeMessage.match(/^NOTICE:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+THIS IS NOTICE$/)).be.ok;
        should(errorMessage.match(/^ERROR:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+THIS IS ERROR$/)).be.ok;
    });

    it('should print logs on console with console output', async () => {
        let lines = [];
        const restore = intercept(line => {
            if (!line.startsWith(' ')) {
                lines.push(line);
                return '';
            }
        });
        await logger.print("How are you");
        await logger.debug("Fine, thank you");
        restore();
        lines.length.should.be.exactly(2);
        should(lines[0].match(/^PRINT:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+How are you$/)).be.ok;
        should(lines[1].match(/^DEBUG:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+Fine, thank you$/)).be.ok;
    });
});
