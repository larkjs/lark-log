/**
 * Console Output printer
 * prints logs in console
 **/

'use strict';

import _debug       from 'debug';
import BaseOutput   from './BaseOutput';

const debug = _debug("lark-log");

class ConsoleOutput extends BaseOutput {
    write (content) {
        debug("ConsoleOutput: write log");
        console.log(content);
    }
}

export default ConsoleOutput;

debug("ConsoleOutput: load ok");
