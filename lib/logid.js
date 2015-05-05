"use strict";
function getLogid(){
    if(request.query['Tc-Default-Logid']){
      info.logid = request.query['Tc-Default-Logid'];
    }else{
      info.logid = logid.genLogid();
}
function generateLogid(logid){
    return logid || Date.now() * 1000 + Math.round(Math.random() * 1000)
}

module.exports = generateLogid
