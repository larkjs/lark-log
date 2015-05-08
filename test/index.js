'use strict';

var assert = require("assert");
var debug = require('debug')('log')
describe('sample use', function(){
    it('should equal without config', function(){
        var logger = require('../').configure({ 
            console: {
                //////// follow lines are only for test
                'transport': function(data){
                    console.log(data.output);
                    return data;
                },
                ////////// above lines are only for test
            },
        });
        var o = logger.debug('hello');
        assert.equal(o.message, 'hello');
        assert.equal(o.file, 'index.js');
        assert.equal(o.level, 2);
        assert.equal(o.title, 'debug');
    });

});
describe('logid', function(){
    it('should use config logid', function(){
        var logger = require('../').configure({
            logid:123
        });
        var o = logger.info('logging.info');
        //assert.equal(o.logid, 123);
        //assert.equal(o.message, 'hello');
        //assert.equal(o['file'], 'index.js');
        //assert.equal(o['level'], 3);
        //assert.equal(o['title'], 'info');
    });

});
