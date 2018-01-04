/**
 * Test/Example for some special cases
 **/
'use strict';

process.mainModule  = module;
const fs            = require('fs');
const intercept     = require('intercept-stdout');
const misc          = require('vi-misc');
const should        = require('should');
const LarkLog       = require('lark-log');
misc.async.all(fs);


describe('log levels', () => {

    let logger = {};

    it('should be ok create a new logger with level 3', async () => {
        logger = new LarkLog();
        logger.useDefaultConfig();
        logger.configure({ level: 3 });
    });

    it('should print logs for level >= 3', async () => {
        await logger.notice('NOTICE');
        await logger.warn('WARN');
        await logger.error('ERROR');
        await logger.fatal('FATAL');
        let notice = await fs.readFileAsync(misc.path.absolute('./logs/system.log'));
        let error = await fs.readFileAsync(misc.path.absolute('./logs/system.log.wf'));
        notice = notice.toString().split('\n').filter(line => !!line);
        error = error.toString().split('\n').filter(line => !!line);
        let fatalMessage = error.pop();
        let errorMessage = error.pop();
        let warnMessage = notice.pop();
        let noticeMessage = notice.pop();
        should(noticeMessage.match(/^NOTICE:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+NOTICE$/)).be.ok;
        should(warnMessage.match(/^WARN:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+WARN$/)).be.ok;
        should(errorMessage.match(/^ERROR:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+ERROR$/)).be.ok;
        should(fatalMessage.match(/^FATAL:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+FATAL$/)).be.ok;
    });

    it('should not print for level <= 2', async () => {
        let lines = [];
        const restore = intercept(line => {
            if (!line.startsWith(' ')) {
                lines.push(line);
                return '';
            }
        });
        await logger.debug('DEBUG');
        await logger.print('PRINT');
        await logger.trace('TRACE');
        restore();
        lines.length.should.be.exactly(0);
        let notice = await fs.readFileAsync(misc.path.absolute('./logs/system.log'));
        notice = notice.toString().split('\n').filter(line => !!line);
        let traceMessage = notice.pop();
        should(traceMessage.match(/^TRACE:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+TRACE$/)).be.not.ok;
    });

    it('should truncate long message', async () => {
        let i = 0;
        let message = [];
        while (i++ < 20000) {
            message.push(i % 10);
        }
        await logger.notice(message.join(''));
        let notice = await fs.readFileAsync(misc.path.absolute('./logs/system.log'));
        notice = notice.toString().split('\n').filter(line => !!line);
        message = notice.pop();
        message.length.should.be.exactly(2000 + 3);
        message.endsWith('...').should.be.ok;
        should(message.match(/^NOTICE:\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+12345678901234567890/)).be.ok;
    });

});
