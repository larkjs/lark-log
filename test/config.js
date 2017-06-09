/**
 * Test the log module with customized configs
 **/
'use strict';

const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');

const LarkLog = require('..');
const Output  = require('../lib/Output');

const defaultConfig = require('../config/default.js');

describe('create an instance of LarkLog with configs with default configs', () => {
    const myConfig = {
        defaultType: null,
        methods: {
            xxx: {
                output: 'stderr',
            },
            yyyy: {
                level: 3,
                output: 'yyyy',
            },
            access: {
                level: 4,
                output: 'io',
            },
            dao: {
                level: 4,
                output: 'io',
            },
        },
        outputs: {
            io: {
                type: 'file',
                path: path.join(__dirname, 'logs/io.log'),
                format: ' ',
                maxlength: 0,
            },
            stderr: {
                type: 'stderr',
                format: '<%- content %>',
            },
            yyyy: {
            }
        }
    };
    const logger = new LarkLog(myConfig);
    logger.configure();

    it('should return an instance of LarkLog', done => {
        logger.should.be.an.instanceOf(LarkLog);
        done();
    });

    it('should have methods as defined in the default config', done => {
        for (const methodName in defaultConfig.methods) {
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function);
        }
        done();
    });

    it('should have outputs as defined in the default config', done => {
        logger.outputs.should.be.an.instanceOf(Object);
        for (const outputName in defaultConfig.outputs) {
            logger.outputs.should.have.ownProperty(outputName).which.is.an.instanceOf(Output);
        }
        done();
    });

    it('should have methods as defined in the custom config', done => {
        for (const methodName in myConfig.methods) {
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function);
        }
        done();
    });

    it('should have outputs as defined in the custom config', done => {
        logger.outputs.should.be.an.instanceOf(Object);
        for (const outputName in myConfig.outputs) {
            logger.outputs.should.have.ownProperty(outputName).which.is.an.instanceOf(Output);
        }
        done();
    });

    it('should create log files under directory "logs"', done => {
        logger.access("Access");
        logger.dao("Dao");

        fs.statSync(path.join(__dirname, "logs")).isDirectory().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/error.log")).isFile().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/system.log")).isFile().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/io.log")).isFile().should.be.exactly(true);
        done();
    });

    it('should remove stream when closed', done => {
        logger.close();
        Object.keys(logger.outputs).length.should.be.exactly(0);
        for (const methodName in defaultConfig.methods) {
            logger.should.not.have.ownProperty(methodName);
        }
        done();
    });
});

describe('create an instance of LarkLog with configs without default configs', () => {
    const myConfig = {
        inherit: false,
        path: 'logs/newlogs',
        level: 5,
        methods: {
            access: {
                level: 4,
                output: 'io',
            },
            dao: {
                level: 4,
                output: 'io',
            },
        },
        outputs: {
            io: {
                type: 'file',
                path: 'io.log',
                format: '<%- method %>:\t<%- new Date %>\t<%- content %>',
                maxLength: 10000,
            },
            stdout: null,
        }
    };
    const logger = new LarkLog({inherit: false});
    logger.configure(myConfig);

    it('should return an instance of LarkLog', done => {
        logger.should.be.an.instanceOf(LarkLog);
        done();
    });

    it('should not have methods as defined in the default config', done => {
        for (const methodName in defaultConfig.methods) {
            logger.should.not.have.ownProperty(methodName);
        }
        done();
    });

    it('should not have outputs as defined in the default config', done => {
        logger.outputs.should.be.an.instanceOf(Object);
        for (const outputName in defaultConfig.outputs) {
            logger.outputs.should.not.have.ownProperty(outputName);
        }
        done();
    });

    it('should have methods as defined in the custom config', done => {
        for (const methodName in myConfig.methods) {
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function);
        }
        done();
    });

    it('should have outputs as defined in the custom config', done => {
        logger.outputs.should.be.an.instanceOf(Object);
        for (const outputName in myConfig.outputs) {
            if (myConfig.outputs[outputName] === null) {
                continue;
            }
            logger.outputs.should.have.ownProperty(outputName).which.is.an.instanceOf(Output);
        }
        done();
    });

    it('should create log files under directory "logs"', done => {
        logger.access("Access");
        logger.dao("Dao");

        fs.statSync(path.join(__dirname, "logs")).isDirectory().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/newlogs")).isDirectory().should.be.exactly(true);
        fs.statSync(path.join(__dirname, "logs/newlogs/io.log")).isFile().should.be.exactly(true);
        done();
    });

    it('should remove stream when closed', done => {
        logger.close();
        Object.keys(logger.outputs).length.should.be.exactly(0);
        for (const methodName in myConfig.methods) {
            logger.should.not.have.ownProperty(methodName);
        }
        done();
    });
});
