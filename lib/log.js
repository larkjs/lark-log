/**
 * lark-log - log.js
 * Copyright(c) 2014 mdemo(https://github.com/demohi)
 * MIT Licensed
 */

'use strict';

var tracer = require('tracer');
var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')('lark-log:log');
var streams = [];

function log(options) {
    var config = options || {};
    if (!_.isFunction(config.transport) && _.isObject(config.files)) {
        config.transport = function (data) {
            var title = data.title;
            var level = config.files[title];
            if (_.isObject(level) && _.isString(level.path)) {
                if (streams[title]) {
                    debug('stream %s already exists', title);
                    streams[title].write(data.output);
                } else {
                    var conf = {
                        encoding: 'utf8',
                        flags: 'a'
                    };
                    level.options = _.merge(conf, level.options);
                    var stream = fs.createWriteStream(level.path, level.options);
                    debug('create stream %s', title);
                    stream.write(data.output + "\n");
                    debug('wriet data:', data.output);
                    streams[title] = stream;
                    debug('stream %s saved to streams', title);
                }
                return {
                    data: data,
                    level: level
                }
            } else {
                console.log(data.output);
                return data;
            }

        }
    } else {
        config.transport = function (data) {
            console.log(data.output);
            return data;
        }
    }
    return tracer.console(config);
}


module.exports = log;
