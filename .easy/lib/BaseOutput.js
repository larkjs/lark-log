/**
 * Base Output printer
 **/

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _dateFormat = require('date-format');

var _dateFormat2 = _interopRequireDefault(_dateFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)("lark-log");

/**
 * BaseOutput, abstract
 * interface to implement:
 * |- init();
 * |- process([object] values);
 * |- write([string] content); 
 **/
class BaseOutput {
    constructor(config) {
        debug("BaseOutput: constructing");
        this.config = (0, _extend2.default)(true, {}, config);
        if (this.init instanceof Function) {
            this.init();
        }
        debug("BaseOutput: constructing ok");
    }
    print(content, method, callback) {
        debug("BaseOutput: executing");
        if (false === this._accessible) {
            throw new Error("Closed output can not print any logs");
        }
        if (content instanceof Buffer) {
            content = content.toString();
        }
        if (content instanceof Object) {
            try {
                content = JSON.stringify(content);
            } catch (e) {
                throw new Error("Can not convert log content from object to json: " + e.message);
            }
        }
        if ('string' !== typeof content) {
            throw new Error("Log content must be a string");
        }
        if (!(this.write instanceof Function)) {
            throw new Error("BaseOutput instance must have method write");
        }
        debug("BaseOutput: checking ok");
        let values = {
            method: method.toUpperCase(),
            content: content,
            datetime: format => {
                const now = new Date();
                if ('string' !== typeof format) {
                    return now.toString();
                }
                return (0, _dateFormat2.default)(format, now);
            }
        };
        debug("BaseOutput: preparing content");
        if (this.process instanceof Function) {
            values = this.process(values) || values;
        }
        content = this.parse(values);
        if (!(callback instanceof Function)) {
            callback = err => {};
        }
        this.write(content, values, callback);
        return this;
    }
    process(values) {
        //absolute method
    }
    close() {
        this._accessible = false;
        return this;
    }
    parse(values) {
        debug("BaseOutput: parse values into log message in format");
        if ('string' !== typeof this.config.format) {
            debug("BaseOutput: format undefined, do nothing");
            return values.content;
        }
        debug("BaseOutput: parse with ejs engine");
        return _ejs2.default.render(this.config.format, values);
    }
}

exports.default = BaseOutput;

debug("BaseOutput: load ok");