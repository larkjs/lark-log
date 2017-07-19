/**
 * Test the log module with default configs and uses
 **/
'use strict';

const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');
const sinon   = require('sinon');

const LarkLog = require('..');
const Output  = require('../lib/Output');

const config = require('../config/default.js');

describe('instance of LarkLog', () => {

    it('should throw if log file is not writable', done => {
        const logger = new LarkLog();
        logger.on('error', (e) => {
            e.should.be.an.instanceof(Error).with.property('message', 'write after end');
            done();
        });
        logger.outputs.system.close().then(() => {
            logger.warn('Fake');
        });
    });

    it('should throw if file stream writing error', (done) => {
        const logger = new LarkLog();
        const stub = sinon.stub(logger.outputs.system.stream, "write");
        stub.callsFake((content, callback) => setImmediate(() => callback(new Error('Fake Write Stream Error'))));
        logger.on('error', (e) => {
            e.should.be.an.instanceof(Error).with.property('message', 'Fake Write Stream Error');
            done();
        });
        logger.notice('hello');
        stub.restore();
    });
});
