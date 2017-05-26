/**
 * Test the log module with default configs and uses
 **/
'use strict';

const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');

const LarkLog = require('..');
const Output  = require('../lib/Output');

const config = require('../config/default.js');

describe('create an instance of LarkLog', () => {
    const logger = new LarkLog();

    it('should return an instance of LarkLog', done => {
        logger.should.be.an.instanceOf(LarkLog);
        done();
    });

    it('should have methods as defined in the config', done => {
        for (const methodName in config.methods) {
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function).with.lengthOf(1);
        }
        done();
    });

    it('should have outputs as defined in the config', done => {
        logger.outputs.should.be.an.instanceOf(Object);
        for (const outputName in config.outputs) {
            logger.outputs.should.have.ownProperty(outputName).which.is.an.instanceOf(Output);
        }
        done();
    });

    it('should remove stream when closed', done => {
        logger.close();
        Object.keys(logger.outputs).length.should.be.exactly(0);
        for (const methodName in config.methods) {
            logger.should.not.have.ownProperty(methodName);
        }
        done();
    });

    it('should create log files under directory "logs"', done => {
        fs.statSync(path.join(__dirname, "logs")).isDirectory().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/error.log")).isFile().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/system.log")).isFile().should.be.exactly(true);
        done();
    });
});
