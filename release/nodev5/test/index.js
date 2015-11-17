/**
 * Test
 **/

'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _deepEql = require('deep-eql');

var _deepEql2 = _interopRequireDefault(_deepEql);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _testConsole = require('test-console');

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _BaseOutput = require('../lib/BaseOutput');

var _BaseOutput2 = _interopRequireDefault(_BaseOutput);

var _ConsoleOutput = require('../lib/ConsoleOutput');

var _ConsoleOutput2 = _interopRequireDefault(_ConsoleOutput);

var _FileStreamOutput = require('../lib/FileStreamOutput');

var _FileStreamOutput2 = _interopRequireDefault(_FileStreamOutput);

var _default = require('../config/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)('lark-log');

debug('Test: starting test lark-log');

describe('lark-log', () => {
    debug('Test: testing lark-log');
    const logger = new _2.default();
    it('should be an instance of Logger', done => {
        debug('Test: testing lark log should be an instance of Logger');
        logger.should.be.an.instanceOf(_2.default);
        done();
    });
    it('should have property config which is equal with default config', done => {
        debug('Test: testing lark log should have default config');
        logger.should.have.property('config').which.is.an.instanceOf(Object);
        const expect = parseConfig((0, _extend2.default)(true, {}, _default2.default));
        (0, _deepEql2.default)(logger.config, expect).should.be.exactly(true);
        done();
    });
    it('should have method configure, clear, close, and defineMethods', done => {
        debug('Test: testing lark log should have reserved methods');
        const methods = ['configure', 'clear', 'close', 'defineMethods'];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                let method = _step.value;

                logger.should.have.property(method).which.is.an.instanceOf(Function);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
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
        Object.keys(logger.outputs).length.should.be.exactly(Object.keys(logger.config.outputs).length);
        for (let output in logger.config.outputs) {
            let Class = _FileStreamOutput2.default;
            if (output === 'console') {
                Class = _ConsoleOutput2.default;
            }
            debug('Test: testing lark log should have outputs ' + output + ' as a ' + Class.name);
            logger.outputs.should.have.property(output).which.is.an.instanceOf(Class);
        }
        done();
    });
});

describe('lark-log create', () => {
    debug('Test: testing lark-log create');
    it('should return an instance of Logger', done => {
        const logger = _2.default.create();
        logger.should.be.an.instanceOf(_2.default);
        done();
    });
});

describe('lark-log configure', () => {
    debug('Test: testing lark-log configure');
    const logger = new _2.default();
    it('should have property config which is equal with customized config', done => {
        const config = {
            level: 3,
            outputs: {
                access: {
                    path: "logs/access.log.<%- datetime('yyyyMMddhh') %>'"
                }
            }
        };
        const expect = parseConfig((0, _extend2.default)(true, (0, _extend2.default)(true, {}, _default2.default), config));
        logger.configure(config);
        debug('Test: testing lark-log configure result');
        (0, _deepEql2.default)(logger.config, expect).should.be.exactly(true);
        done();
    });
});

describe('lark-config console output', () => {
    debug('Test: testing lark-log console output');
    const logger = new _2.default();
    const methods = ['debug', 'log', 'trace'];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = methods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            let method = _step2.value;

            it('should print logs by ' + method, done => {
                debug('Test: testing lark-log console output result by ' + method);
                const message = 'printed by logger.' + method;
                const out = _testConsole.stdout.inspectSync(() => {
                    logger[method](message);
                });
                out.should.be.an.instanceOf(Array).with.lengthOf(1);
                out[0].should.be.an.instanceOf(String);
                const regexp = makeLogRegExp(method, message);
                (!!out[0].match(makeLogRegExp(method, message))).should.be.exactly(true);
                done();
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
});

process.on('exit', () => {
    debug('Test: clearing test logs dir');
    const logDir = _path2.default.join(__dirname, 'logs');
    _child_process2.default.execSync('rm -rf ' + logDir);
});

describe('lark-log file stream output', () => {
    debug('Test: testing lark-log file stream output');
    const logger = new _2.default();
    const logDir = _path2.default.join(__dirname, 'logs');

    let methodsAll = {
        access: {
            methods: ['request', 'perform'],
            log: 'access.log'
        },
        info: {
            methods: ['info', 'notice'],
            log: 'app.log'
        },
        sys: {
            methods: ['warn', 'error', 'fatal'],
            log: 'app.log.wf'
        }
    };

    for (let output in methodsAll) {
        debug('Test: testing lark-log file stream output to ' + output + ' log');
        const methods = methodsAll[output].methods;
        const log = methodsAll[output].log;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = methods[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                let method = _step3.value;

                it('should print file logs by ' + method, done => {
                    debug('Test: testing lark-log file stream output result to ' + output + ' log by ' + method);
                    const logPath = _path2.default.join(logDir, log);
                    debug("Test: clearing existing " + output + " log");
                    try {
                        _child_process2.default.execSync('1>/dev/null 2>&1 echo "" > ' + logPath);
                    } catch (e) {
                        debug("Test: clearing failed, error message : " + e.message);
                    }
                    const message = 'printed by logger.' + method;

                    logger[method](message, err => {
                        const out = _fs2.default.readFileSync(logPath).toString();
                        (!!out.match(makeLogRegExp(method, message))).should.be.exactly(true);
                        done();
                    });
                });
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        ;
    }
});

describe('lark-log close', () => {
    debug('Test: testing lark-log close');
    const logger = new _2.default();
    logger.close();
    it('should throw if print', done => {
        let error = null;
        try {
            logger.log("printed after closed!");
        } catch (e) {
            error = e;
        }
        (0, _should2.default)(error).be.an.instanceOf(Error);
        done();
    });
    it('should not throw if configured again', done => {
        logger.configure();
        let error = null;
        let out = null;
        const method = 'log';
        const message = 'printed after closed!';
        try {
            out = _testConsole.stdout.inspectSync(() => {
                logger[method](message);
            });
        } catch (e) {
            error = e;
        }
        (0, _should2.default)(error).be.an.be.exactly(null);
        (0, _should2.default)(out).be.an.instanceOf(Array).with.lengthOf(1);
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
        item.path = _path2.default.join(__dirname, item.path);
    }
    return config;
}

function makeLogRegExp(method, content) {
    return new RegExp('^\\n?' + method.toUpperCase() + ': [A-Z][a-z]{2} [A-Z][a-z]{2} \\d{2} \\d{4} \\d{2}:\\d{2}:\\d{2} .*? ' + content + '\\n$');
};