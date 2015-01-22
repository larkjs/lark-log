/**
 * lark-log - test/index.js
 * Copyright(c) 2014 mdemo(https://github.com/demohi)
 * MIT Licensed
 */

'use strict';

var assert = require("assert");

describe('sample use', function(){
    it('should equal without config', function(){
        var logger = require('../')();
        var o = logger.info('hello');
        assert.equal(o['message'], 'hello');
        assert.equal(o['file'], 'index.js');
        assert.equal(o['level'], 3);
        assert.equal(o['title'], 'info');
    });

});
