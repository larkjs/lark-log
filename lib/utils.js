"use strict";

const fs = require('fs');

module.exports = {
    makeDir (path) {
        if (!path) {
            return;
        }
        try {
            testPath(path);
        } catch(e) {
            if (e && e.code === "ENOENT"){
                fs.mkdirSync(path)
                return;
            }else{
                throw e
            }
        }
        
    },
    getTimeDetail () {
        let now = new Date();
        let year = now.getFullYear()
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let hour = now.getHours();
        let min = now.getMinutes();
        let sec = now.getSeconds();
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
    getTime () {
        let time = this.getTimeDetail();
        return time.datetime;
    }
}

function testPath (path) {
    let stats = fs.statSync(path);
    if (stats.isDirectory()){
        return;
    }else{
        throw new Error("log root path need to be a dir.");
    }
}
