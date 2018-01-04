# lark-log

This is Lark.js log module.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![NPM downloads][downloads-image]][npm-url]
[![Node.js dependencies][david-image]][david-url]

## Useage

### sample 

```javascript
const LarkLogger = require('lark-log');

const logger = new LarkLogger({ 'using-default': true });

logger.notice("Hello");
```

### configure

```javascript

const LarkLogger = require('lark-log');

const logger = new LarkLogger();

const config = {
    {
    "@description": "This is the default config",
    "level": 1,
    "methods": {
        "debug": {
            "level": 1,
            "output": "console"
        },
        "print": {
            "level": 2,
            "output": "console"
        },
        "trace": {
            "level": 2,
            "output": "system"
        },
        "notice": {
            "level": 3,
            "output": "system"
        },
        "warn": {
            "level": 4,
            "output": "system"
        },
        "error": {
            "level": 5,
            "output": "error"
        },
        "fatal": {
            "level": 5,
            "output": "error"
        }
    },
    "outputs": {
        "default": {
            "line-max-length": 2000,
            "format": "<%= method.toUpperCase() %>:\t<%= date('yyyy-mm-dd HH:MM:ss')%>\t<%= content %>",
            "path-prefix": "logs/",
            "path-suffix": ".log"
        },
        "console": null,
        "system": {
            "path": "system"
        },
        "error": {
            "path": "system",
            "path-suffix": ".log.wf"
        }
    }
};

logger.configure(config);

logger.debug('debug');// write "debug " to terminal
logger.notice('notice');// write "NOTICE: {DATETIME} notice" to system.log, {DATETIME} is in "yyyy-mm-dd HH:MM:ss" style
logger.error('error');//write to system.log.wf
```

### logrotate

```
logger.configure({
    "outputs": {
        "default": {
            "path-suffix": ".log.<%= date('yyyymmddHH') %>"
        }
    }
});
```

* If '<%' exists in path (including prefix and suffix), the path will be regarded as a dynamic path. LarkLog calculates the path every when an output came.

[npm-image]: https://img.shields.io/npm/v/lark-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-log
[travis-image]: https://img.shields.io/travis/larkjs/lark-log/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-log
[downloads-image]: https://img.shields.io/npm/dm/lark-log.svg?style=flat-square
[david-image]: https://img.shields.io/david/larkjs/lark-log.svg?style=flat-square
[david-url]: https://david-dm.org/larkjs/lark-log
[coveralls-image]: https://img.shields.io/codecov/c/github/larkjs/lark-log.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/larkjs/lark-log

