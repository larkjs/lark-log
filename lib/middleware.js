"use strict";
var generateLogid = require("./logid")
var configure = require("./configure")

var makeLogid = function(){
    var logid
    if (this.request.query.logid){
        logid = this.request.query.logid
    }else{
        logid = generateLogid()
        this.request.query.logid = logid
    }
    return logid
}

var middleware = function (config){
    var logger = configure(config)
    return function *(next){
        var logid = makeLogid.bind(this)()
        logger.request({
            "logid": logid
        })       
        yield next;
        logger.perform({
            "logid": logid
        })
    }
};
module.exports = middleware
