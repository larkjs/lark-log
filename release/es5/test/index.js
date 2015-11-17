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

var debug = (0, _debug3.default)('lark-log');

debug('Test: starting test lark-log');

describe('lark-log', function () {
    debug('Test: testing lark-log');
    var logger = new _2.default();
    it('should be an instance of Logger', function (done) {
        debug('Test: testing lark log should be an instance of Logger');
        logger.should.be.an.instanceOf(_2.default);
        done();
    });
    it('should have property config which is equal with default config', function (done) {
        debug('Test: testing lark log should have default config');
        logger.should.have.property('config').which.is.an.instanceOf(Object);
        var expect = parseConfig((0, _extend2.default)(true, {}, _default2.default));
        (0, _deepEql2.default)(logger.config, expect).should.be.exactly(true);
        done();
    });
    it('should have method configure, clear, close, and defineMethods', function (done) {
        debug('Test: testing lark log should have reserved methods');
        var methods = ['configure', 'clear', 'close', 'defineMethods'];
        for (var _iterator = methods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var method = _ref;

            logger.should.have.property(method).which.is.an.instanceOf(Function);
        }
        done();
    });
    it('should have methods defined in config', function (done) {
        debug('Test: testing lark log should have methods defined in config');
        for (var method in logger.config.methods) {
            logger.should.have.property(method).which.is.an.instanceOf(Function);
        }
        done();
    });
    it('should have outputs defined in config', function (done) {
        debug('Test: testing lark log should have outputs defined in config');
        logger.should.have.property('outputs').which.is.an.instanceOf(Object);
        Object.keys(logger.outputs).length.should.be.exactly(Object.keys(logger.config.outputs).length);
        for (var output in logger.config.outputs) {
            var Class = _FileStreamOutput2.default;
            if (output === 'console') {
                Class = _ConsoleOutput2.default;
            }
            debug('Test: testing lark log should have outputs ' + output + ' as a ' + Class.name);
            logger.outputs.should.have.property(output).which.is.an.instanceOf(Class);
        }
        done();
    });
});

describe('lark-log configure', function () {
    debug('Test: testing lark-log configure');
    var logger = new _2.default();
    it('should have property config which is equal with customized config', function (done) {
        var config = {
            level: 3,
            outputs: {
                access: {
                    path: "logs/access.log.<%- datetime('yyyyMMddhh') %>'"
                }
            }
        };
        var expect = parseConfig((0, _extend2.default)(true, (0, _extend2.default)(true, {}, _default2.default), config));
        logger.configure(config);
        debug('Test: testing lark-log configure result');
        (0, _deepEql2.default)(logger.config, expect).should.be.exactly(true);
        done();
    });
});

describe('lark-config console output', function () {
    debug('Test: testing lark-log console output');
    var logger = new _2.default();
    var methods = ['debug', 'log', 'trace'];

    var _loop = function _loop(method) {
        it('should print logs by ' + method, function (done) {
            debug('Test: testing lark-log console output result by ' + method);
            var message = 'printed by logger.' + method;
            var out = _testConsole.stdout.inspectSync(function () {
                logger[method](message);
            });
            out.should.be.an.instanceOf(Array).with.lengthOf(1);
            out[0].should.be.an.instanceOf(String);
            var regexp = makeLogRegExp(method, message);
            (!!out[0].match(makeLogRegExp(method, message))).should.be.exactly(true);
            done();
        });
    };

    for (var _iterator2 = methods, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
        } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
        }

        var method = _ref2;

        _loop(method);
    }
});

process.on('exit', function () {
    debug('Test: clearing test logs dir');
    var logDir = _path2.default.join(__dirname, 'logs');
    _child_process2.default.execSync('rm -rf ' + logDir);
});

describe('lark-log file stream output', function () {
    debug('Test: testing lark-log file stream output');
    var logger = new _2.default();
    var logDir = _path2.default.join(__dirname, 'logs');

    var methodsAll = {
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

    var _loop2 = function _loop2(output) {
        debug('Test: testing lark-log file stream output to ' + output + ' log');
        var methods = methodsAll[output].methods;
        var log = methodsAll[output].log;

        var _loop3 = function _loop3(method) {
            it('should print file logs by ' + method, function (done) {
                debug('Test: testing lark-log file stream output result to ' + output + ' log by ' + method);
                var logPath = _path2.default.join(logDir, log);
                debug("Test: clearing existing " + output + " log");
                try {
                    _child_process2.default.execSync('1>/dev/null 2>&1 echo "" > ' + logPath);
                } catch (e) {
                    debug("Test: clearing failed, error message : " + e.message);
                }
                var message = 'printed by logger.' + method;

                logger[method](message, function (err) {
                    var out = _fs2.default.readFileSync(logPath).toString();
                    (!!out.match(makeLogRegExp(method, message))).should.be.exactly(true);
                    done();
                });
            });
        };

        for (var _iterator3 = methods, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
            }

            var method = _ref3;

            _loop3(method);
        };
    };

    for (var output in methodsAll) {
        _loop2(output);
    }
});

describe('lark-log close', function () {
    debug('Test: testing lark-log close');
    var logger = new _2.default();
    logger.close();
    it('should throw if print', function (done) {
        var error = null;
        try {
            logger.log("printed after closed!");
        } catch (e) {
            error = e;
        }
        (0, _should2.default)(error).be.an.instanceOf(Error);
        done();
    });
    it('should not throw if configured again', function (done) {
        logger.configure();
        var error = null;
        var out = null;
        var method = 'log';
        var message = 'printed after closed!';
        try {
            out = _testConsole.stdout.inspectSync(function () {
                logger[method](message);
            });
        } catch (e) {
            error = e;
        }
        (0, _should2.default)(error).be.an.be.exactly(null);
        (0, _should2.default)(out).be.an.instanceOf(Array).with.lengthOf(1);
        out[0].should.be.an.instanceOf(String);
        var regexp = makeLogRegExp(method, message);
        (!!out[0].match(makeLogRegExp(method, message))).should.be.exactly(true);
        done();
    });
});

function parseConfig(config) {
    config.root = module.filename;
    for (var output in config.outputs) {
        var item = config.outputs[output];
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