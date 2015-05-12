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
            this.app.on('error', function(err, ctx){
                logging.error({"message": err});
            })
            var logid = getLogid.bind(this)()
            logging.request({
                "logid": logid,
                "headers": this.headers
            })       
            yield next;
            logging.perform({
                "logid": logid
            })
        }
    }
}

module.exports = middleware
