/**
 * File Stream Output printer
 * print logs into log files in stream
 **/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _dateFormat = require('date-format');

var _dateFormat2 = _interopRequireDefault(_dateFormat);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stream = require('stream');

var _BaseOutput2 = require('./BaseOutput');

var _BaseOutput3 = _interopRequireDefault(_BaseOutput2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug3.default)("lark-log");

var FileStreamOutput = (function (_BaseOutput) {
    _inherits(FileStreamOutput, _BaseOutput);

    function FileStreamOutput() {
        _classCallCheck(this, FileStreamOutput);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FileStreamOutput).apply(this, arguments));
    }

    _createClass(FileStreamOutput, [{
        key: 'write',
        value: function write(content, values, callback) {
            debug("FileStreamOutput: writting log");
            this.stream.writeActive(content + '\n', callback);
        }
    }, {
        key: 'createStream',
        value: function createStream(filePath) {
            var _this2 = this;

            debug("FileStreamOutput: creating stream on path " + filePath);
            _mkdirp2.default.sync(_path2.default.dirname(filePath));
            var stream = _fs2.default.createWriteStream(filePath, {
                flags: 'a',
                encoding: 'utf-8',
                mode: 438
            });
            stream.name = _path2.default.basename(filePath);
            stream.path = filePath;
            stream.active_time = Date.now();

            debug("FileStreamOutput: " + stream.name + " add method writeActive to stream, which will update active time when writing");
            stream.writeActive = function (chunk, encoding, callback) {
                debug("FileStreamOutput: " + stream.name + " writing and updating active time");
                stream.active_time = Date.now();
                stream.write(chunk, encoding, callback);
            };

            var lifeCycle = 30000;
            debug("FileStreamOutput: " + stream.name + " watching a stream, will close it if not active for " + lifeCycle + "ms");
            stream.watcher = setInterval(function () {
                debug("FileStreamOutput: " + stream.name + " checking if the stream is active");
                if (Date.now() - stream.active_time <= lifeCycle - 500) {
                    debug("FileStreamOutput: " + stream.name + " the stream is active");
                    return;
                }
                debug("FileStreamOutput: " + stream.name + " the stream is not active, remove it");
                _this2.clearStream();
            }, lifeCycle / 5);

            stream.on('error', function (error) {
                debug("FileStreamOutput: " + stream.name + " stream error");
                console.log(error.stack);
                process.exit(1);
            });

            this.clearStream();

            this._stream = stream;

            debug("FileStreamOutput: " + stream.name + " stream got");

            return stream;
        }
    }, {
        key: 'clearStream',
        value: function clearStream() {
            debug("FileStreamOutput: clearing stream");
            if (!(this._stream instanceof _stream.Writable)) {
                debug("FileStreamOutput: stream not exist");
                return this;
            }
            var name = this._stream.name;
            clearInterval(this._stream.watcher);
            this._stream.end();
            delete this._stream;
            debug("FileStreamOutput: " + name + " clearing stream ok");
            return this;
        }
    }, {
        key: 'close',
        value: function close() {
            _get(Object.getPrototypeOf(FileStreamOutput.prototype), 'close', this).call(this);
            this.clearStream();
            return this;
        }
    }, {
        key: 'stream',
        get: function get() {
            debug("FileStreamOutput: getting stream");
            var filePath = _ejs2.default.render(this.config.path, {
                datetime: function datetime(format) {
                    var now = new Date();
                    if ('string' !== typeof format) {
                        return now.toString();
                    }
                    return (0, _dateFormat2.default)(format, now);
                }
            });

            if (!(this._stream instanceof _stream.Writable) || this._stream.path !== filePath) {
                debug("FileStreamOutput: stream is out of date, create a new one");
                this.createStream(filePath);
            }

            return this._stream;
        }
    }]);

    return FileStreamOutput;
})(_BaseOutput3.default);

exports.default = FileStreamOutput;

debug("FileStreamOutput: load ok");