'use strict';
var util = require('util')

var ConsoleLogger = function(){

}

util._extend( ConsoleLogger.prototype, {
    'configure': function(){
        /*empty*/   
    },
    'write': function(msg){
        console.log(msg)
    }
})

module.exports = ConsoleLogger
