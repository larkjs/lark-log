'use strict';

require('debug');
const Logger  = require('..');

const logger = new Logger();

process.mainModule = module;

logger.debug('Printed by debug');
logger.log('Printed by log');
logger.trace('Printed by trace');

logger.notice('Printed by notice');
logger.warn('Printed by warn');

logger.error('Printed by error');
logger.fatal('Printed by fatal');

setTimeout(() => {
    logger.warn('Printed by warn after 1s');
    logger.close();
}, 1000);
