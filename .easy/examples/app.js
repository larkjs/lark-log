'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)("lark-log");
var logger = new _2.default();

debug("Example: print console logs");
logger.log("Printed by log");
logger.debug("Printed by debug");
logger.trace("Printed by trace");

debug("Example: print access logs");
logger.request("Printed by request");
logger.response("Printed by response");

debug("Example: print info logs");
logger.info("Printted by info");
logger.notice("Printed by notice");

debug("Example: print sys logs");
logger.warn("Printed by warn");
logger.error("Printed by error");
logger.fatal("Printed by fatal");

setTimeout(function () {
    logger.perform("Printed by perform after 35s");
    logger.warn("Printed by warn after 35s");
    logger.close();
}, 35000);