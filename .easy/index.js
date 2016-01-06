/**
 * Logging
 **/
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _saveInstance = require('save-instance');

var _saveInstance2 = _interopRequireDefault(_saveInstance);

var _BaseOutput = require('./lib/BaseOutput');

var _BaseOutput2 = _interopRequireDefault(_BaseOutput);

var _ConsoleOutput = require('./lib/ConsoleOutput');

var _ConsoleOutput2 = _interopRequireDefault(_ConsoleOutput);

var _FileStreamOutput = require('./lib/FileStreamOutput');

var _FileStreamOutput2 = _interopRequireDefault(_FileStreamOutput);

var _default = require('./config/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)("lark-log");

class Logger {
    constructor(options) {
        debug("Logger: constructing");
        if (!(this.config instanceof Object)) {
            this.config = (0, _extend2.default)(true, {}, _default2.default);
        }
        if ('string' !== typeof this.config.root) {
            this.config.root = process.mainModule.filename;
        }
        this.configure(options);
        debug("Logger: constructing ok");
    }
    static create(options) {
        return new Logger(options);
    }
    configure(options) {
        debug("Logger: configure start");
        if (options instanceof Object) {
            debug("Logger: using options");
            if (options.default === false) {
                debug("Logger: removing default configs by options");
                delete options.default;
                this.config = {};
            }
            this.config = (0, _extend2.default)(true, this.config, options);
        }
        if (!(this.config instanceof Object)) {
            debug("Logger: using default options");
            this.config = (0, _extend2.default)(true, {}, _default2.default);
        }
        if ('string' !== typeof this.config.root) {
            this.config.root = process.mainModule.filename;
        }
        this.defineMethods();
        return this;
    }
    clear() {
        debug("Logger: clearing all methods generated last time when defineMethods was called");
        for (let method in this) {
            if (this[method] instanceof Function && !Logger.prototype[method]) {
                delete this[method];
            }
        }

        debug("Logger: clearing output logger");
        for (let output in this.outputs || {}) {
            this.outputs[output].close();
        }

        this.outputs = {};

        return this;
    }
    close() {
        debug("Logger: closing");
        this.clear();
        delete this.config;
        return this;
    }
    defineMethods() {
        debug("Logger: define methods by config");

        if (!(this.config.methods instanceof Object) || !(this.config.outputs instanceof Object)) {
            console.warn("Config.methods/outputs must be an object, abort to define logger methods");
            return this;
        }

        this.clear();

        debug("Logger: add output logger");
        for (let output in this.config.outputs) {
            let config = this.config.outputs[output] || {};
            if (!(config instanceof Object)) {
                throw new Error("Config.outputs must be an object");
            }
            if (!config.type || 'string' !== typeof config.type) {
                config.type = '';
            }
            let outputPrinter = null;
            switch (config.type.toLowerCase()) {
                case 'console':
                    outputPrinter = new _ConsoleOutput2.default(config);
                    break;
                case 'stream':
                default:
                    config.type = 'filestream';
                    if (!_path2.default.isAbsolute(config.path)) {
                        debug("Logger: change relative path to absolute path");
                        config.path = _path2.default.join(_path2.default.dirname(this.config.root), config.path);
                    }
                    outputPrinter = new _FileStreamOutput2.default(config);
                    break;
            }
            debug("Logger: add output printer " + output + ' as a ' + config.type + ' printer');
            this.outputs[output] = outputPrinter;
        }

        debug("Logger: add methods by config");
        for (let method in this.config.methods) {
            let config = (0, _extend2.default)(true, {}, this.config.methods[method]);
            let output = this.outputs[config.output];
            if (!(output instanceof _BaseOutput2.default)) {
                throw new Error("Output printer not found!");
            }
            this[method] = (content, callback) => {
                debug("Logger: method " + method + " is called");
                if (config.level < this.config.level) {
                    debug("Logger: method " + method + " low level, abort printing logs");
                    return;
                }
                output.print(content, method, callback);
                return this;
            };
        }

        debug("Logger: define methods done");
    }
}
(0, _saveInstance2.default)(Logger);

debug("Logger: load ok");
exports.default = Logger;
