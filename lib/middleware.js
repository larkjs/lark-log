"use strict";

const generateLogid = require("./logid")

function getLogid () {
    if (!this) {
        throw new Error('Function getLogid must be applied on an Koa Context!');
    }
    if (this.state && this.state.logid){
        return this.state.logid;
    }
    else if (this.request && this.request.query.logid){
        this.state.logid = this.request.query.logid;
        return this.state.logid;
    }
    else if(this.request && this.request.query['Tc-Default-Logid']){
        this.state.logid = this.request.query['Tc-Default-Logid'];
        return this.state.logid;
    }
    else{
        this.state.logid = generateLogid();
        return this.state.logid;
    }
}

function middleware (logging){
    return (config) => {
        let favicon_path = "/favicon.ico";
        if (config) {
            logging.configure(config);
        }
        config = config || logging.conf || {};
        if (config.favicon) {
            favicon_path = config.favicon;
        }
        if (config.middleware instanceof Function) {
            let middleware = config.middleware({
                config: config,
                logging: logging,
                favicon_path: favicon_path,
                getLogid: getLogid
            });
            if (middleware instanceof Function && middleware.constructor.name === 'GeneratorFunction') {
                return middleware;
            }
        }

        return function *(next) {
            if (favicon_path == this.path) {
                return yield next;
            }
            this.log = logging;
            let logid = getLogid.call(this);
            logging.request({
                "logid": logid,
                "method": this.method,
                "url": this.url,
                "headers": this.headers,
            }, this)       
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
            }, this)
        }
    }
}

module.exports = middleware;
