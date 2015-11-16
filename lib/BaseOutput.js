/**
 * Base Output printer
 **/

'use strict';

import _debug   from 'debug';
import ejs      from 'ejs';
import extend   from 'extend';

const debug = _debug("lark-log");

/**
 * BaseOutput, abstract
 * interface to implement:
 * |- init();
 * |- process([object] values);
 * |- write([string] content); 
 **/
class BaseOutput {
    constructor (config) {
        debug("BaseOutput: constructing");
        this.config = extend(true, {}, config);
        if (this.init instanceof Function) {
            this.init();
        }
        debug("BaseOutput: constructing ok");
    }
    print (content, method) {
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
        let values = {
            method: method.toUpperCase(),
            content: content,
        };
        debug("BaseOutput: preparing content");
        if (this.process instanceof Function) {
            values = this.process(values) || values;
        }
        content = this.parse(values);
        this.write(content, values);
        return this;
    }
    process (values) {
        //absolute method
    }
    close () {
        this._accessible = false;
        return this;
    }
    parse (values) {
        debug("BaseOutput: parse values into log message in format");
        if ('string' !== typeof this.config.format) {
            debug("BaseOutput: format undefined, do nothing");
            return values.content;
        }
        debug("BaseOutput: parse with ejs engine");
        return ejs.render(this.config.format, values);
    }
}

export default BaseOutput;

debug("BaseOutput: load ok");
