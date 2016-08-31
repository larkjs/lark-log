'use strict';

const debug   = require('debug')('lark-log.examples');
const Logger  = require('..');

const logger = new Logger();

debug("Example: set main module to this module for test");
process.mainModule = module;

debug("Example: print console logs");
logger.debug("Printed by debug");
logger.log("Printed by log");
logger.trace("Printed by trace");

debug("Example: print system logs");
logger.notice("Printed by notice");
logger.warn("Printed by warn");

debug("Example: print sys logs");
logger.error("Printed by error");
logger.fatal("Printed by fatal");

setTimeout(() => {
    logger.warn("Printed by warn after 1s");
    logger.close();
}, 1000);
