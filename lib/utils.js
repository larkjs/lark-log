"use strict";
var fs = require('fs')
module.exports = {
    'makeDir': function(path){
        if (!path) {
            return;
        }
        try {
            var stats = fs.statSync(path)
                if (stats.isDirectory()){
                    return;
                }else{
                    throw "log root path need to be a dir."
                }
        } catch(e) {
            if (e && e.code === "ENOENT"){
                fs.mkdirSync(path)
                    return;
            }else{
                throw e
            }
        }
        
    },
    'getTimeDetail' : function () {
        var now = new Date();
        var year = now.getFullYear()
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();
        month < 10 ? month = '0' + month : null;
        date < 10 ? date = '0' + date : null;
        hour < 10 ? hour = '0' + hour : null;
        min < 10 ? min = '0' + min : null;
        sec < 10 ? sec = '0' + sec : null;
        return {
            year  : year,
            month : month,
            date  : date,
            hour  : hour,
            min   : min,
            sec   : sec,
            // %d-%d-%d %d:%d:%d
            datetime : year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec,
        };
    },
    'getTime': function(){
        var time = this.getTimeDetail();
        return time.datetime;
    }
}
