"use strict";
var generateLogid = require("./logid")

var getLogid = function(){
    if (this.state.logid){
        return this.state.logid
    } else if (this.request.query.logid){
        this.state.logid = this.request.query.logid
        return this.state.logid
    } else if(this.request.query['Tc-Default-Logid']){
        this.state.logid = this.request.query['Tc-Default-Logid'];
        return this.state.logid
    }else{
        this.state.logid = generateLogid()
        return this.state.logid
    }
}

var middleware = function (logging){
    return function(config){
        var favicon_path = "/favicon.ico"
        if (config) {
            logging.configure(config)
            if (config.favicon) {
                favicon_path = config.favicon
            }
        }
        return function *(next) {
            if (favicon_path == this.path) {
                return yield next;
            }
            this.log = logging;
            var logid = getLogid.bind(this)()
            logging.request({
                "logid": logid,
                "method": this.method,
                "url": this.url,
                "headers": this.headers,
            })       
            try {
                yield next;
            }
            catch (e) {
                if (!e.status || e.status.toString().match(/^5\d\d$/)) {
                    logging.error({"message": e});
                }
                throw e;
            }
            logging.perform({
                "logid": logid,
                "statusCode": this.status,
            })
        }
    }
}

module.exports = middleware
