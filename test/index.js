/**
 * Test
 **/

'use strict'

import _debug   from 'debug';
import cp       from 'child_process';
import eql      from 'deep-eql';
import extend   from 'extend';
import fs       from 'fs';
import path     from 'path';
import should   from 'should';
import {stdout} from 'test-console';
import Logger   from '..';
import BaseOutput       from '../lib/BaseOutput';
import ConsoleOutput    from '../lib/ConsoleOutput';
import FileStreamOutput from '../lib/FileStreamOutput';
import defaultConfig    from '../config/default';

const debug = _debug('lark-log');

debug('Test: starting test lark-log');

describe('lark-log', () => {
    debug('Test: testing lark-log');
    const logger = new Logger();
    it('should be an instance of Logger', done => {
        debug('Test: testing lark log should be an instance of Logger');
        logger.should.be.an.instanceOf(Logger);
        done();
    });
    it('should have property config which is equal with default config', done => {
        debug('Test: testing lark log should have default config');
        logger.should.have.property('config').which.is.an.instanceOf(Object);
        const expect = parseConfig(extend(true, {}, defaultConfig));
        eql(logger.config, expect).should.be.exactly(true);
        done();
    });
    it('should have method configure, clear, close, and defineMethods', done => {
        debug('Test: testing lark log should have reserved methods');
        const methods = ['configure', 'clear', 'close', 'defineMethods'];
        for (let method of methods) {
            logger.should.have.property(method).which.is.an.instanceOf(Function);
        }
        done();
    });
    it('should have methods defined in config', done => {
        debug('Test: testing lark log should have methods defined in config');
        for (let method in logger.config.methods) {
            logger.should.have.property(method).which.is.an.instanceOf(Function);
        }
        done();
    });
    it('should have outputs defined in config', done => {
        debug('Test: testing lark log should have outputs defined in config');
        logger.should.have.property('outputs').which.is.an.instanceOf(Object);
        Object.keys(logger.outputs).length.should.be.exactly((Object.keys(logger.config.outputs).length));
        for (let output in logger.config.outputs) {
            let Class = FileStreamOutput;
            if (output === 'console') {
                Class = ConsoleOutput;
            }
            debug('Test: testing lark log should have outputs ' + output + ' as a ' + Class.name);
            logger.outputs.should.have.property(output).which.is.an.instanceOf(Class);
        }
        done();
    });
});

describe('lark-log configure', () => {
    debug('Test: testing lark-log configure');
    const logger = new Logger();
    it('should have property config which is equal with customized config', done => {
        const config = {
            level: 3,
            outputs: {
                access: {
                    path: "logs/access.log.<%- datetime('yyyyMMddhh') %>'",
                }
            },
        };
        const expect = parseConfig(extend(true, extend(true, {}, defaultConfig), config));
        logger.configure(config);
        debug('Test: testing lark-log configure result');
        eql(logger.config, expect).should.be.exactly(true);
        done();
    });
});

describe('lark-config console output', () => {
    debug('Test: testing lark-log console output');
    const logger = new Logger();
    const methods = ['debug', 'log', 'trace'];
    for (let method of methods) {
        it('should print logs by ' + method, done => {
            debug('Test: testing lark-log console output result by ' + method);
            const message = 'printed by logger.' + method;
            const out = stdout.inspectSync(() => {
                logger[method](message);
            });
            out.should.be.an.instanceOf(Array).with.lengthOf(1);
            out[0].should.be.an.instanceOf(String);
            const regexp = makeLogRegExp(method, message);
            (!!out[0].match(makeLogRegExp(method, message))).should.be.exactly(true);
            done();
        });
    }
});

process.on('exit', () => {
    debug('Test: clearing test logs dir');
    const logDir = path.join(__dirname, 'logs');
    cp.execSync('rm -rf ' + logDir);
});

describe('lark-log file stream output', () => {
    debug('Test: testing lark-log file stream output');
    const logger = new Logger();
    const logDir = path.join(__dirname, 'logs');
    
    let methodsAll = {
        access: {
            methods: ['request', 'perform'],
            log: 'access.log',
        },
        info: {
            methods: ['info', 'notice'],
            log: 'app.log',
        },
        sys: {
            methods: ['warn', 'error', 'fatal'],
            log: 'app.log.wf'
        },
    };

    for (let output in methodsAll) {
        debug('Test: testing lark-log file stream output to ' + output + ' log');
        const methods = methodsAll[output].methods;
        const log     = methodsAll[output].log;
        for (let method of methods) {
            it('should print file logs by ' + method, done => {
                debug('Test: testing lark-log file stream output result to ' + output + ' log by ' + method);
                const logPath = path.join(logDir, log);
                debug("Test: clearing existing " + output + " log");
                try {
                    cp.execSync('1>/dev/null 2>&1 echo "" > ' + logPath);
                }
                catch (e) {
                    debug("Test: clearing failed, error message : " + e.message);
                }
                const message = 'printed by logger.' + method;

                logger[method](message, (err) => {
                    const out = fs.readFileSync(logPath).toString();
                    (!!out.match(makeLogRegExp(method, message))).should.be.exactly(true);
                    done();
                });
            });
        };
    }
});

describe('lark-log close', () => {
    debug('Test: testing lark-log close');
    const logger = new Logger();
    logger.close();
    it('should throw if print', done => {
        let error = null;
        try {
            logger.log("printed after closed!");
        }
        catch (e) {
            error = e;
        }
        should(error).be.an.instanceOf(Error);
        done();
    });
    it('should not throw if configured again', done => {
        logger.configure();
        let error = null;
        let out = null;
        const method = 'log';
        const message = 'printed after closed!';
        try {
            out = stdout.inspectSync(() => {
                logger[method](message);
            });
        }
        catch (e) {
            error = e;
        }
        should(error).be.an.be.exactly(null);
        should(out).be.an.instanceOf(Array).with.lengthOf(1);
        out[0].should.be.an.instanceOf(String);
        const regexp = makeLogRegExp(method, message);
        (!!out[0].match(makeLogRegExp(method, message))).should.be.exactly(true);
        done();
    });
});

function parseConfig(config) {
    config.root = module.filename;
    for (let output in config.outputs) {
        let item = config.outputs[output];
        if ('string' !== typeof item.type) {
            item.type = 'filestream';
        }
        if ('string' !== typeof item.path) {
            continue;
        }
       item.path = path.join(__dirname, item.path);
    }
    return config;
}

function makeLogRegExp (method, content) {
    return new RegExp('^\\n?' + method.toUpperCase() + ': [A-Z][a-z]{2} [A-Z][a-z]{2} \\d{2} \\d{4} \\d{2}:\\d{2}:\\d{2} .*? ' + content + '\\n$');
};
