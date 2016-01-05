/**
 * Console Output printer
 * prints logs in console
 **/

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _BaseOutput = require('./BaseOutput');

var _BaseOutput2 = _interopRequireDefault(_BaseOutput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)("lark-log");

class ConsoleOutput extends _BaseOutput2.default {
    write(content, values, callback) {
        debug("ConsoleOutput: write log");
        console.log(content);
        callback();
    }
}

exports.default = ConsoleOutput;

debug("ConsoleOutput: load ok");