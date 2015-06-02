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
            this._stream = this.createStream();
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
        this.logPathSplit = false;
        this.logPath = this.makeLogPath();
    },
    'makeLogPath' : function () {
        if ('string' === typeof this.conf.path) {
            return this.conf.path;
        }
        else if ('string' === typeof this.conf.logPathFormat) {
            var tplVars = {};
            if (this.logPathSplit || 
                (this.conf.splitFormat && this.conf.logPathFormat.indexOf("{{split}}") >= 0)) {
                this.logPathSplit = true;
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
            return path.join(this.conf.root, template(this.conf.logPathFormat, tplVars));
        }
        else {
            return path.join(this.conf.root, this.conf.name + ".log");
        }
    },
    'createStream': function(){
        var option = {
          'flags': 'a',
          'encoding': 'utf-8',
          'mode': 438
        }
        this.logPath = this.makeLogPath();
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
