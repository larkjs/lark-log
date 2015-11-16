/**
 * Console Output printer
 * prints logs in console
 **/

'use strict';

import _debug       from 'debug';
import BaseOutput   from './BaseOutput';

const debug = _debug("lark-log");

class ConsoleOutput extends BaseOutput {
    write (content, values, callback) {
        debug("ConsoleOutput: write log");
        console.log(content);
        callback();
    }
}

export default ConsoleOutput;

debug("ConsoleOutput: load ok");
