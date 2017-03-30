/**
 * Output the logs into writable stream
 **/
'use strict';

const $         = require('lodash');
const assert    = require('assert');
const ejs       = require('ejs');
const Writable  = require('stream').Writable;

class Output {
    constructor (stream, options = {}) {
        if (stream !== process.stdout && stream !== process.stderr) {
            assert(stream instanceof Writable, 'Stream for output must be a writable stream');
        }
        assert(options instanceof Object, 'Options for output must be an object');

        this.stream = stream;
        this.config = $.cloneDeep(options);
    }
    output (info) {
        let content = this.parse(info);
        if (this.config.maxLength >= 0) {
            content = content.slice(0, this.config.maxLength);
        }
        return new Promise((resolve, reject) => {
            this.stream.write(content + '\n', error => {
                if (error) return reject(error);
                return resolve(this);
            });
        });
    }
    parse (info) {
        if ('string' !== typeof this.config.format || this.config.format.trim() === '') {
            return info;
        }
        else {
            return ejs.render(this.config.format, info);
        }
    }
    close () {
        return new Promise((resolve, reject) => {
            if (this.stream === process.stdout || this.stream === process.stderr) {
                return resolve();
            }
            this.stream.end(error => {
                if (error) return reject(error);
                return resolve();
            });
        });
    }
}

module.exports = Output;
