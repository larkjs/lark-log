'use strict';

const util = require('util')

// Export this class
class ConsoleLogger {
    configure () {
        // DO NOTHING, EMPTY
    }
    write (msg) {
        console.log(msg);
    }
};
module.exports = ConsoleLogger;
