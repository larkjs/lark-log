/**
 * Console Output printer
 * prints logs in console
 **/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _BaseOutput2 = require('./BaseOutput');

var _BaseOutput3 = _interopRequireDefault(_BaseOutput2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug3.default)("lark-log");

var ConsoleOutput = (function (_BaseOutput) {
    _inherits(ConsoleOutput, _BaseOutput);

    function ConsoleOutput() {
        _classCallCheck(this, ConsoleOutput);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ConsoleOutput).apply(this, arguments));
    }

    _createClass(ConsoleOutput, [{
        key: 'write',
        value: function write(content, values, callback) {
            debug("ConsoleOutput: write log");
            console.log(content);
            callback();
        }
    }]);

    return ConsoleOutput;
})(_BaseOutput3.default);

exports.default = ConsoleOutput;

debug("ConsoleOutput: load ok");