/**
 * Test the log module with default configs and uses
 **/
'use strict';

process.mainModule = module;

const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');
const stdout  = require("test-console").stdout;

const LarkLog = require('..');
const Output  = require('../lib/Output');

const config = require('../config/default.js');

describe('print logs', () => {
    const logger = new LarkLog();

    it('should print in stdout', async () => {
        const inspect = stdout.inspect();
        logger.debug('This is DEBUG');
        logger.log('This is LOG');
        logger.trace('This is TRACE');
        
        inspect.restore();
        const lines = inspect.output;

        lines.should.be.an.instanceOf(Array).with.lengthOf(3);

        let line = null;
        line = lines[0].split('\t').map(o => o.trim());
        line[0].should.be.exactly('DEBUG:');
        line[2].should.be.exactly('This is DEBUG');

        line = lines[1].split('\t').map(o => o.trim());
        line[0].should.be.exactly('LOG:');
        line[2].should.be.exactly('This is LOG');

        line = lines[2].split('\t').map(o => o.trim());
        line[0].should.be.exactly('TRACE:');
        line[2].should.be.exactly('This is TRACE');
    });

    it('should print in log files system.log', async () => {
        let originalContent = fs.readFileSync(path.join(__dirname, 'logs/system.log')).toString();

        await logger.notice('This is NOTICE');
        await logger.warn('This is WARN');

        let addedContent = fs.readFileSync(path.join(__dirname, 'logs/system.log')).toString();
        addedContent = addedContent.slice(originalContent.length);

        const lines = addedContent.split('\n');

        let line = null;
        line = lines[0].split('\t').map(o => o.trim());
        line[0].should.be.exactly('NOTICE:');
        line[2].should.be.exactly('This is NOTICE');

        line = lines[1].split('\t').map(o => o.trim());
        line[0].should.be.exactly('WARN:');
        line[2].should.be.exactly('This is WARN');
    });

    it('should print in log files error.log', async () => {
        let originalContent = fs.readFileSync(path.join(__dirname, 'logs/error.log')).toString();

        await logger.error('This is ERROR');
        await logger.fatal('This is FATAL');

        let addedContent = fs.readFileSync(path.join(__dirname, 'logs/error.log')).toString();
        addedContent = addedContent.slice(originalContent.length);

        const lines = addedContent.split('\n');

        let line = null;
        line = lines[0].split('\t').map(o => o.trim());
        line[0].should.be.exactly('ERROR:');
        line[2].should.be.exactly('This is ERROR');

        line = lines[1].split('\t').map(o => o.trim());
        line[0].should.be.exactly('FATAL:');
        line[2].should.be.exactly('This is FATAL');
    });
});
