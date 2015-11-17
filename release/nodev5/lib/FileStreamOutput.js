/**
 * File Stream Output printer
 * print logs into log files in stream
 **/

'use strict';

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

var _BaseOutput = require('./BaseOutput');

var _BaseOutput2 = _interopRequireDefault(_BaseOutput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)("lark-log");

class FileStreamOutput extends _BaseOutput2.default {
    write(content, values, callback) {
        debug("FileStreamOutput: writting log");
        this.stream.writeActive(content + '\n', callback);
    }
    get stream() {
        debug("FileStreamOutput: getting stream");
        let filePath = _ejs2.default.render(this.config.path, {
            datetime: format => {
                const now = new Date();
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
    createStream(filePath) {
        debug("FileStreamOutput: creating stream on path " + filePath);
        _mkdirp2.default.sync(_path2.default.dirname(filePath));
        const stream = _fs2.default.createWriteStream(filePath, {
            flags: 'a',
            encoding: 'utf-8',
            mode: 438
        });
        stream.name = _path2.default.basename(filePath);
        stream.path = filePath;
        stream.active_time = Date.now();

        debug("FileStreamOutput: " + stream.name + " add method writeActive to stream, which will update active time when writing");
        stream.writeActive = (chunk, encoding, callback) => {
            debug("FileStreamOutput: " + stream.name + " writing and updating active time");
            stream.active_time = Date.now();
            stream.write(chunk, encoding, callback);
        };

        const lifeCycle = 30000;
        debug("FileStreamOutput: " + stream.name + " watching a stream, will close it if not active for " + lifeCycle + "ms");
        stream.watcher = setInterval(() => {
            debug("FileStreamOutput: " + stream.name + " checking if the stream is active");
            if (Date.now() - stream.active_time <= lifeCycle - 500) {
                debug("FileStreamOutput: " + stream.name + " the stream is active");
                return;
            }
            debug("FileStreamOutput: " + stream.name + " the stream is not active, remove it");
            this.clearStream();
        }, lifeCycle / 5);

        stream.on('error', error => {
            debug("FileStreamOutput: " + stream.name + " stream error");
            console.log(error.stack);
            process.exit(1);
        });

        this.clearStream();

        this._stream = stream;

        debug("FileStreamOutput: " + stream.name + " stream got");

        return stream;
    }
    clearStream() {
        debug("FileStreamOutput: clearing stream");
        if (!(this._stream instanceof _stream.Writable)) {
            debug("FileStreamOutput: stream not exist");
            return this;
        }
        let name = this._stream.name;
        clearInterval(this._stream.watcher);
        this._stream.end();
        delete this._stream;
        debug("FileStreamOutput: " + name + " clearing stream ok");
        return this;
    }
    close() {
        super.close();
        this.clearStream();
        return this;
    }
}

exports.default = FileStreamOutput;

debug("FileStreamOutput: load ok");