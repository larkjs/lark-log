var logging = require('../../lark-log').logging
logging.configure({"level": 1})
logging.log("log log")
logging.debug("debug log")
logging.configure({"level": 2})
logging.log("log log which should not be displayed")
logging.debug("debug log which should be not displayed")
logging.trace({'logid': 123456, 'message': "trace log"})
logging.configure({"level": 3})
logging.trace("trace log which should not display")
logging.request({'logid': 123456})
logging.perform({'logid': 123456})
logging.info({'logid': 123456})
logging.notice({'logid': 123456})
logging.warn({'logid': 123456})
logging.error({'logid': 123456})
logging.fatal({'logid': 123456})
setTimeout(function () {
    //logging.daily_logger.stream.end('')
    process.exit(1)
}, 1000);
