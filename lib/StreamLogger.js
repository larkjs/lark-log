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

StreamLogger.prototype.__defineGetter__('stream', function () {
    if (!this._stream) {
        this._stream = this.createStream();
    }
    if (this.logPathSplit) {
        var logPath = this.makeLogPath();
        if (this.logPath !== logPath) {
            this.close();
            this._stream = this.createStream(logPath);
        }
    };
    return this._stream;
});

util._extend( StreamLogger.prototype, {
    'configure': function(conf){
        if (conf) {
            this.conf = util._extend(this.conf, conf) 
        }
        this.conf.root = this.conf.root || './';
        this.conf.name = this.conf.name || 'app';
        /** 考虑到在程序中切割日志，需要在每次打印日志前检查是否要打印在新的日志中
         *  在流量较高的时候，每一次打印日志都会消耗一定掉性能，从而积少成多，带来性能隐患
         *  考虑到实际项目中，日志切割多以 小时 或者 日 为单位切割，因此可以对此进行优化，
         *  每次打印日志时，只检查与上一次生成日志路径时间的间隔，如果少于切割时间单位，则直接跳过切割逻辑
         *  从而使大多数日志打印工作，会跳过日志切割中不必要的检查逻辑，减少性能损耗
         *  此处logPathSplit就是用来存储相关信息的变量
         **/
        if (this.conf.splitFormat && this.conf.logPathFormat.indexOf("{{split}}") >= 0) {
            this.logPathSplit = {
                lastPath  : null,
                lastCount  : Date.now(),
            };
            if (this.conf.splitFormat.indexOf('s') >= 0) {
                this.logPathSplit.min = 1000;
            }
            if (this.conf.splitFormat.indexOf('m') >= 0) {
                this.logPathSplit.min = 1000 * 60;
            }
            if (this.conf.splitFormat.indexOf('h') >= 0) {
                this.logPathSplit.min = 1000 * 60 * 60;
            }
            if (this.conf.splitFormat.indexOf('d') >= 0) {
                this.logPathSplit.min = 1000 * 60 * 60 * 24;
            }
        }
        else {
            this.logPathSplit = false;
        }
    },
    'makeLogPath' : function () {
        if ('string' === typeof this.conf.path) {
            return this.conf.path;
        }
        else if ('string' === typeof this.conf.logPathFormat) {
            var tplVars = {};
            if (this.logPathSplit) {
                if (this.logPathSplit.lastPath && 
                    this.logPathSplit.lastCount >= Math.floor(Date.now() / this.logPathSplit.min) - 1) {
                        return this.logPathSplit.lastPath;
                }

                var time = utils.getTimeDetail();
                var split = this.conf.splitFormat.replace(/y+/ig , time.year)
                                .replace(/m+/ig, time.month)
                                .replace(/d+/ig, time.date)
                                .replace(/h+/ig, time.hour)
                                .replace(/i+/ig, time.min)
                                .replace(/s+/ig, time.sec);
                tplVars.split = split;
            }
            tplVars.name = this.conf.name;
            var logPath = path.join(this.conf.root, template(this.conf.logPathFormat, tplVars));
            if (this.logPathSplit) {
                this.logPathSplit.lastPath = logPath;
                this.logPathSplit.lastCount = Math.floor(Date.now() / this.logPathSplit.min);
            }
            return logPath;
        }
        else {
            return path.join(this.conf.root, this.conf.name + ".log");
        }
    },
    'createStream': function(logPath){
        var option = {
          'flags': 'a',
          'encoding': 'utf-8',
          'mode': 438
        }
        this.logPath = logPath || this.makeLogPath();
        var stream = fs.createWriteStream(this.logPath, option)
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
                me.watch = setInterval(me.watchLogFile(), 30000);
            });
        });
        stream.on('close', function () {
            me.close()
        });
        stream.on('error', function (err) {
            console.log(process.pid, ' ', me.logPath, ' bdlog error : ', err, new Date());
            me.close()
            process.exit(1);
        });
        return stream;
    },
    'watchLogFile': function() {
        var me = this
        return function () {
            fs.stat(me.logPath, function (err, stat) {
                if (err !== null && err.code === 'ENOENT' ||
                    err === null && stat.ino !== me.logIno) {
                    me.close()
                    me._stream = me.createStream();
                }
            });
        };
    },
    'close': function () {
        clearInterval(this.watch);
        //this._stream.destroySoon();
        this._stream && this._stream.end();
        this._stream = null;
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
        var stream = this.stream;
        if (stream.writable) {
            stream.write(log + '\n');
        } else {
            throw new Error('unable to write log file', new Date());
        }

    }
})

module.exports = StreamLogger
