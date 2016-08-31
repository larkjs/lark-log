/**
 * Test the log module with default configs and uses
 **/
'use strict';

process.mainModule = module;

const debug   = require('debug')('lark-log.test');
const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');
const stdout  = require("test-console").stdout;

const LarkLog = require('..');
const Output  = require('../lib/Output');

const config = require('../config/default.js');

debug('loading ...');

describe('print logs', () => {
    const logger = new LarkLog();

    it('should print in stdout', done => {
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

        done();
    });

    it('should print in log files system.log', done => {
        const originalContent = fs.readFileSync(path.join(__dirname, 'logs/system.log')).toString();

        Promise.all([
            logger.notice('This is NOTICE'),
            logger.warn('This is WARN'),
        ]).then(() => {
            const addedContent = fs.readFileSync(path.join(__dirname, 'logs/system.log')).toString().slice(originalContent.length);

            const lines = addedContent.split('\n');

            let line = null;
            line = lines[0].split('\t').map(o => o.trim());
            line[0].should.be.exactly('NOTICE:');
            line[2].should.be.exactly('This is NOTICE');

            line = lines[1].split('\t').map(o => o.trim());
            line[0].should.be.exactly('WARN:');
            line[2].should.be.exactly('This is WARN');

            done();
        });
    });
});

debug('loaded!');