lark-log 是一套日志系统,用来记录系统日志，信息，错误以及一套方便日后利用日志进行debug的规则。

在lark-log中有3种不同的日志，分别有不同的功能。
    - pv 日志。记录请求和返回的日志。系统默认集成
    - 自定义日志。包括捕获的warning日志，请求后端服务的 notice 日志，以及其它自定义日志。自定义日志用来记录服务请求后端服务的日志和系统的信息。自定义日志记录需要用户手工记录。
    - 错误日志。记录node.js系统抛出的错误，系统的错误日志以及其它不在pv和自定义日志中的日志。系统默认集成, 也需要用户在错误处理逻辑中添加。

## pv 日志

pv 日志主要用来计算用户pv和系统提供服务的成功率。pv日志分为 request 和 perform 两种。request 指用户请求日志，可用来计算用户pv. perform 指系统成功返回给用户结果的日志。可用来记录系统提供的服务内容。 lark 通过lark-log模块默认在系统集成了该日志,不需手工添加.

## 自定义日志

自定义日志有 notice, warn, info 等方法. 

记录服务请求后端服务使用 notice 方法。例如:

```
require('lark-log').logging.notice({
    'talkwith': 'redis',
})

```

对于已知的不会引起系统崩溃或出错的系统警告信息，使用 warn 方法。 例如:

```
require('lark-log').logging.warn({
})
```

对于其它自定义信息，推荐使用 info 方法。例如:

```
require('lark-log').logging.info({
})

```

## 错误日志

错误日志有 fatal, error 以及 node 打的系统日志。
错误日志的具体使用方法：
首先需要注意一点，lark 会把不属于pv, 自定义日志的其它所有日志归类为错误日志。
对于捕获到的会引起系统出错的错误，使用 error 方法。

```
server.on("error", function(err){
    require('lark-log').logging.error("error message" + err)
})
```

捕获到的引起系统崩溃的信息，使用 fatal 方法。

```
try{
} catch(err){
    require('lark-log').logging.fatal("fatal message" + err)
}
```

系统要尽量保证没有错误日志输出。如果有输出错误日志，表明有错误需要修复。

## logid

生成logid

```
    var logid = require('lark-log').generate_logid()
```

## 利用日志进行debug
    - 命令行下查看流量

    ```
    cat app.log  | grep REQUEST | awk '{print $3}' | awk 'BEGIN {FS=":"} {print $1$2}' | sort | uniq -c
    ```
    
    - 使用命令行下查看请求后端服务流量

    ```
    cat app.notice.log  | grep 'backend_name' | grep NOTICE |awk '{print $3}' | awk 'BEGIN {FS=":"} {print $1$2$3}' | sort | uniq -c
    ```
    
    - 查看请求后端错误情况

    ```
    cat app.notice.log   | grep 'backend_name' | grep WARN| awk '{print $3}' | awk 'BEGIN {FS=":"} {print $1$2$3}' | sort | uniq -c
    ```

    - 系统上线时，查看node.log是否有日志出现。原则上 node.log 是不应该有日志的。
    
    ```
    tail -f node.log
    ```

    - 系统出问题时，通过logid串连进行debug。
    

## 自定义 lark-log

### pv日志的自定义用法:

如果要添加自定义日志到 request 日志中，可通过如下方式:

```
    var app = require('lark').setRequestLog(function(ctx){
        ctx.state.requestLog.custom_parameter = custom_parameter
    })
```

如果需要手工添加可通过如下方式:

```
var logging = require('lark-log').logging
//`this` is `ctx` variance in middleware, 
//which refers to koa's Request object.
logging.request({
    'timestamp': new Date,
    'headers': this.headers, 
    'url': this.url,
    'method': this.method,
    'originalUrl': this.originalUrl,
    'href': this.href,
    'protocol': this.protocol,
    'ip': this.ip,
    'ips' this.ips,
    'logid': this.state.logid // custom info
    };
})

logging.perform({
    "logid": req.logid,
    "return_code": res.statusCode,
    //"gid": req.gid,
    "consume_time": (new Date().getTime() - req.start_time),
    //"cache_address": req.cache_address,
    //"packing_size": res.fileSize,
    //"novel_name": res.title,
    //"packing_chapter_num": res.chapter_num,
    //"range": res.range,
    //"sendHeader":res.sendHeader
})
```

### 配置lark-log

可以通过lark-log的配置接口进行配置

```
    var logging = require("lark-log").configure().logging
```

