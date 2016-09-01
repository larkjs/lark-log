# lark-log

This is Lark.js log module.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![NPM downloads][downloads-image]][npm-url]
[![Node.js dependencies][david-image]][david-url]

## Useage

### sample 

```javascript
const LarkLogger = require('lark-log');

<<<<<<< HEAD
const logger = new LarkLogger();

logger.info('info message');
=======
var logger = new LarkLogger();

logger.log("Hello");
>>>>>>> 59cf5f77d2102dfe70b7f3a17f30ca76ef59062a
```

### configure

```javascript

const LarkLogger = require('lark-log');

<<<<<<< HEAD
const logger = new LarkLogger();

const config = {
=======
// set default to false, or the default config will be loaded
const logger = new LarkLogger({default: false});

var config = {
    path: "logs",
    defaultType: "file",
    level: 1,
    methods: {
        debug: {
            level: 1,
            output: 'console',
        },
        notice: {
            level: 2,
            output: 'system',
        },
        error: {
            level: 3,
            output: 'error',
        }
    },
>>>>>>> 59cf5f77d2102dfe70b7f3a17f30ca76ef59062a
    outputs: {
        console:{
            type: 'stdout',
        },
        system: {
            path: 'app.log'
            format: '<%- method %>:\t<%- new Date %>\t<%- content %>',
        },
        error: {
            path: 'app.log.wf'
            format: '<%- method %>:\t<%- new Date %>\t<%- content %>',
        }
    }
};

logger.configure(config);

logger.debug('debug');// write "debug " to terminal
logger.notice('notice');// write "NOTICE: {DATETIME} notice" to app.log, {DATETIME} is just what `new Date()` returns
logger.error('error');//write to app.log.wf
```

[npm-image]: https://img.shields.io/npm/v/lark-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-log
[travis-image]: https://img.shields.io/travis/larkjs/lark-log/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-log
[downloads-image]: https://img.shields.io/npm/dm/lark-log.svg?style=flat-square
[david-image]: https://img.shields.io/david/larkjs/lark-log.svg?style=flat-square
[david-url]: https://david-dm.org/larkjs/lark-log

