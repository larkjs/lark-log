"use strict";

function generateLogid(logid){
    return logid || Date.now() * 1000 + Math.round(Math.random() * 1000)
}

module.exports = generateLogid;
