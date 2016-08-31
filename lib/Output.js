/**
 * Output the logs into writable stream
 **/
'use strict';

const $         = require('lodash');
const debug     = require('debug')('lark-log.Output');
const assert    = require('assert');
const ejs       = require('ejs');
const Writable  = require('stream').Writable;

debug('loading ...');

class Output {
    constructor (stream, options = {}) {
        debug('constructor() called ...');
        if (stream !== process.stdout && stream !== process.stderr) {
            assert(stream instanceof Writable, "Stream for output must be a writable stream");
        }
        assert(options instanceof Object, "Options for output must be an object");

        this.stream = stream;
        this.config = $.cloneDeep(options);
    }
    output (info) {
        debug('output() called ...');
        let content = this.parse(info);
        if (this.config.maxLength >= 0) {
            content = content.slice(0, this.config.maxLength);
        }
        return new Promise((resolve, reject) => {
            debug('output() writing ...');
            this.stream.write(content + '\n', error => {
                debug('output() written!');
                if (error) return reject(error);
                return resolve(this);
            });
        });
    }
    parse (info) {
        debug('parse() called ...');
        if ('string' !== typeof this.config.format || this.config.format.trim() === '') {
            return info;
        }
        else {
            return ejs.render(this.config.format, info);
        }
    }
    close () {
        return new Promise((resolve, reject) => {
            debug('close() called ...');
            if (this.stream === process.stdout || this.stream === process.stderr) {
                debug('close() Can not close stdout and stderr, skip ...');
                return resolve();
            }
            this.stream.end(error => {
                if (error) return reject(error);
                debug('close() done!');
                return resolve();
            });
        });
    }
}

module.exports = Output;
debug('loaded!');
