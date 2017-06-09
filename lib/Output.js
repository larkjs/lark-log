/**
 * Output logs via stream
 **/
'use strict';

const assert    = require('assert');
const template  = require('lodash.template');
const extend    = require('extend');

const Writable  = require('stream').Writable;

class Output {
    constructor(stream, options = {}) {
        if (stream !== process.stdout && stream !== process.stderr) {
            assert(stream instanceof Writable, 'Stream for output must be a writable stream');
        }
        assert(options instanceof Object, 'Options for output must be an object');

        this.stream = stream;
        this.config = extend(true, {
            path: 'system.log',
            format: format,
            maxLength: 10000,
        }, options);

        let compiled = info => info.toString();

        if (this.config.format instanceof Function) {
            compiled = this.config.format;
        }
        else if ('string' === typeof this.config.format && this.config.format.match(/<%.*%>/)) {
            compiled = template(this.config.format);
        }
        this.render = info => compiled(info);
    }
    output(info) {
        let content = this.render(info);
        if (this.config.maxLength >= 0 && content.length > this.config.maxLength) {
            content = content.slice(0, this.config.maxLength);
        }
        return new Promise((resolve, reject) => {
            this.stream.write(content + '\n', error => error ? reject(error) : resolve());
        });
    }
    close() {
        if (this.stream === process.stdout || this.stream === process.stderr) {
            return this;
        }
        return new Promise((resolve) => {
            this.stream.end(resolve);
        });
    }
}

function format(info) {
    let date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ` +
           `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return `${info.method}:\t<${date}\t${info.content}`;
}

module.exports = Output;
