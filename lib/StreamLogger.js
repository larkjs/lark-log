'use strict';
var util = require('util')
var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var template = require('./template')

var StreamLogger = function(conf) {
    this.conf = conf || {}
    if (this.conf.root) {
        utils.makeDir(this.conf.root)
    }
    this.configure()
}

util._extend( StreamLogger.prototype, {
    'configure': function(conf){
        if (conf) {
            this.conf = util._extend(this.conf, conf) 
        }
        if(!this.conf.path) {
            this.conf.path = path.join(this.conf.root, this.conf.name + ".log")
        } 
        this.stream = this.createStream(this.conf)
    },
    'createStream': function(conf){
        var option = {
          'flags': 'a',
          'encoding': 'utf-8',
          'mode': 438
        }
        var stream = fs.createWriteStream(conf.path, option)
        var me = this
        stream.on('open', function (fd) {
            me.logFd = fd;
            fs.fstat(me.logFd, function (err, stat) {
                if (err != null) {
                    console.log('lark-log unexpected err : ', err, new Date());
                    process.exit(1);
                    return;
                }
                me.logIno = stat.ino;
                me.watch = setInterval(me.watchLogFile(conf), 30000);
            });
        });
        stream.on('close', function () {
            me.close()
        });
        stream.on('error', function (err) {
            console.log(process.pid, ' ', conf.path, ' bdlog error : ', err, new Date());
            me.close()
            process.exit(1);
        });
        return stream;
    },
    'watchLogFile': function(conf) {
        var me = this
        return function () {
            fs.stat(me.conf.path, function (err, stat) {
                if (err !== null && err.code === 'ENOENT' ||
                    err === null && stat.ino !== me.logIno) {
                    me.close()
                    me.stream = me.createStream(conf);
                }
            });
        };
    },
    'close': function () {
        clearInterval(this.watch);
        this.logStream.destroySoon();
    },
    'makeContext': function(message, method){
        var output_message = "";

        if (typeof message == 'object') {
            output_message = util.inspect(message, false, 1).replace(/\n/g, '');
        } else if (typeof message == 'string' || typeof message == 'number') {
            output_message = message
        } else {
            /* skip it */
        }

        if (output_message.length > this.conf.maxLength) {
            output_message = output_message.substr(0, this.conf.maxLength);
        }

        var context = {
            'datetime': utils.getTime(),
            'method': method.toUpperCase(),
            'message': output_message
        }
        return context
    },
    'write': function(message, method){
        var context = this.makeContext(message, method);
        var log = template(this.conf.format, context)
        if (log.length > this.conf.maxLength) {
            log = log.substr(0, this.conf.maxLength);
        }
        if (this.stream.writable) {
            this.stream.write(log + '\n');
        } else {
            throw new Error('unable to write log file', new Date());
        }

    }
})

module.exports = StreamLogger
