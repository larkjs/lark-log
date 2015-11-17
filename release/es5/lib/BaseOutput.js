/**
 * Base Output printer
 **/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug3.default)("lark-log");

/**
 * BaseOutput, abstract
 * interface to implement:
 * |- init();
 * |- process([object] values);
 * |- write([string] content); 
 **/

var BaseOutput = (function () {
    function BaseOutput(config) {
        _classCallCheck(this, BaseOutput);

        debug("BaseOutput: constructing");
        this.config = (0, _extend2.default)(true, {}, config);
        if (this.init instanceof Function) {
            this.init();
        }
        debug("BaseOutput: constructing ok");
    }

    _createClass(BaseOutput, [{
        key: 'print',
        value: function print(content, method, callback) {
            debug("BaseOutput: executing");
            if (false === this._accessible) {
                throw new Error("Closed output can not print any logs");
            }
            if ('string' !== typeof content) {
                throw new Error("Log content must be a string");
            }
            if (!(this.write instanceof Function)) {
                throw new Error("BaseOutput instance must have method write");
            }
            debug("BaseOutput: checking ok");
            var values = {
                method: method.toUpperCase(),
                content: content,
                datetime: function datetime(format) {
                    var now = new Date();
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
                callback = function (err) {};
            }
            this.write(content, values, callback);
            return this;
        }
    }, {
        key: 'process',
        value: function process(values) {
            //absolute method
        }
    }, {
        key: 'close',
        value: function close() {
            this._accessible = false;
            return this;
        }
    }, {
        key: 'parse',
        value: function parse(values) {
            debug("BaseOutput: parse values into log message in format");
            if ('string' !== typeof this.config.format) {
                debug("BaseOutput: format undefined, do nothing");
                return values.content;
            }
            debug("BaseOutput: parse with ejs engine");
            return _ejs2.default.render(this.config.format, values);
        }
    }]);

    return BaseOutput;
})();

exports.default = BaseOutput;

debug("BaseOutput: load ok");