'use strict';

var assert = require("assert");

describe('sample use', function(){
    it('should equal without config', function(){
        var logger = require('../')();
        var o = logger.info('hello');
        assert.equal(o.message, 'hello');
        assert.equal(o.file, 'index.js');
        assert.equal(o.level, 3);
        assert.equal(o.title, 'info');
    });

});
describe('logid', function(){
    it('should use config logid', function(){
        var logger = require('../')({logid:123});
        var o = logger.info('hello');
        assert.equal(o['logid'], 123);
        assert.equal(o['message'], 'hello');
        assert.equal(o['file'], 'index.js');
        assert.equal(o['level'], 3);
        assert.equal(o['title'], 'info');
    });

});
