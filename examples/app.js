'use strict';

import _debug   from 'debug';
import Logger   from '..';

const debug  = _debug("lark-log");
const logger = new Logger();

debug("Example: print console logs");
logger.log("Printed by log");
logger.debug("Printed by debug");
logger.trace("Printed by trace");

debug("Example: print access logs");
logger.request("Printed by request");
logger.perform("Printed by perform");

debug("Example: print info logs");
logger.info("Printted by info");
logger.notice("Printed by notice");

debug("Example: print sys logs");
logger.warn("Printed by warn");
logger.error("Printed by error");
logger.fatal("Printed by fatal");

setTimeout(() => {
    logger.perform("Printed by perform after 35s");
    logger.warn("Printed by warn after 35s");
    logger.close();
}, 35000);
