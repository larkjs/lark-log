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
        if (config) {
            logging.configure(config)
        }
        return function *(next) {
            this.log = logging;
            var logid = getLogid.bind(this)()
            logging.request({
                "logid": logid,
                "headers": this.headers
            })       
            try {
                yield next;
            }
            catch (e) {
                logging.error({"message": e});
            }
            logging.perform({
                "logid": logid
            })
        }
    }
}

module.exports = middleware
