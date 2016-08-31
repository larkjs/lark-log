/**
 * Test the log module with customized configs
 **/
'use strict';

const debug   = require('debug')('lark-log.test');
const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');

const LarkLog = require('..');
const Output  = require('../lib/Output');

const defaultConfig = require('../config/default.js');

debug('loading ...');

describe('create an instance of LarkLog with configs with default configs', () => {
    const myConfig = {
        methods: {
            xxx: {
                level: 2,
                output: 'stderr',
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
                path: path.join(__dirname, 'logs/io.log'),
                // format: '<%- method %>:\t<%- new Date %>\t<%- content %>',
                format: ' ',
                maxlength: 0,
            },
            stderr: {
                type: 'stderr',
                format: '<%- content %>',
            }
        }
    };
    const logger = new LarkLog(myConfig);

    it('should return an instance of LarkLog', done => {
        logger.should.be.an.instanceOf(LarkLog);
        done();
    });

    it('should have methods as defined in the default config', done => {
        for (const methodName in defaultConfig.methods) {
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function).with.lengthOf(1);
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
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function).with.lengthOf(1);
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
        default: false,
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
            hello: null,
        },
        outputs: {
            io: {
                type: 'file',
                path: 'io.log',
                format: '<%- method %>:\t<%- new Date %>\t<%- content %>',
                maxLength: 10000,
            },
            foo: {
                type: 'undefined-type',
            },
            bar: {},
            what: null,
        }
    };
    const logger = new LarkLog({default: false});
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
            logger.should.have.ownProperty(methodName).which.is.an.instanceOf(Function).with.lengthOf(1);
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

debug('loaded!');
