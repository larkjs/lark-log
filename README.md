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

const logger = new LarkLogger();

logger.info('info message');
```

### configure


```javascript

const LarkLogger = require('lark-log');

const logger = new LarkLogger();

const config = {
    outputs: {
        access:{
            path: 'larkapp.log'
        },
        info: {
            path: 'larkapp.info.log'
        },
        sys: {
            path: 'larkapp.sys.log'
        }
    }
};

logger.configure(config);

logger.debug('debug' + Date.now());// write to terminal
logger.trace('log' + Date.now()); // write to terminal
logger.request('request' + Date.now());// write to access.log
logger.info('info' + Date.now());// write to larkapp.info.log
logger.error('error' + Date.now());//write to larkapp.sys.log
```

[npm-image]: https://img.shields.io/npm/v/lark-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-log
[travis-image]: https://img.shields.io/travis/larkjs/lark-log/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-log
[downloads-image]: https://img.shields.io/npm/dm/lark-log.svg?style=flat-square
[david-image]: https://img.shields.io/david/larkjs/lark-log.svg?style=flat-square
[david-url]: https://david-dm.org/larkjs/lark-log

