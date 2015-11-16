/**
 * File Stream Output printer
 * print logs into log files in stream
 **/

'use strict';

import _debug     from 'debug';
import dateFormat from 'date-format';
import ejs        from 'ejs';
import fs         from 'fs';
import mkdirp     from 'mkdirp';
import path       from 'path';
import { Writable }   from 'stream';
import BaseOutput from './BaseOutput';

const debug = _debug("lark-log");

class FileStreamOutput extends BaseOutput {
    write (content, values, callback) {
        debug("FileStreamOutput: writting log");
        this.stream.writeActive(content + '\n', callback);
    }
    get stream () {
        debug("FileStreamOutput: getting stream");
        let filePath = ejs.render(this.config.path, {
            datetime: (format) => {
                const now = new Date();
                if ('string' !== typeof format) {
                    return now.toString();
                }
                return dateFormat(format, now);
            }
        });

        if (!(this._stream instanceof Writable) || this._stream.path !== filePath) {
            debug("FileStreamOutput: stream is out of date, create a new one");
            this.createStream(filePath);            
        }

        return this._stream;
    }
    createStream (filePath) {
        debug("FileStreamOutput: creating stream on path " + filePath);
        mkdirp.sync(path.dirname(filePath));
        const stream = fs.createWriteStream(filePath, {
            flags: 'a',
            encoding: 'utf-8',
            mode: 438,
        });
        stream.name = path.basename(filePath);
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
    clearStream () {
        debug("FileStreamOutput: clearing stream");
        if (!(this._stream instanceof Writable)) {
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
    close () {
        super.close();
        this.clearStream();
        return this;
    }
}

export default FileStreamOutput;

debug("FileStreamOutput: load ok");
