# lark-log

This is Lark.js log module based on [tracer](https://github.com/baryon/tracer)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![NPM downloads][downloads-image]][npm-url]
[![Node.js dependencies][david-image]][david-url]

## Useage

### sample 

```javascript
var logger = require('lark-log').logger

logger.info('info message');
```

### with files


```javascript
var log = require('lark-log');

var config = {
    'appname': 'lark-app'
};
var logger = log(config);

logger.info('info' + Date.now());// write to info.log
logger.debug('debug' + Date.now());// write to terminal with blue colors
logger.debug('log' + Date.now()); // write to terminal with green colors
logger.error('error' + Date.now());//show in the terminal
```

[npm-image]: https://img.shields.io/npm/v/lark-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-log
[travis-image]: https://img.shields.io/travis/larkjs/lark-log/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-log
[downloads-image]: https://img.shields.io/npm/dm/lark-log.svg?style=flat-square
[david-image]: https://img.shields.io/david/larkjs/lark-log.svg?style=flat-square
[david-url]: https://david-dm.org/larkjs/lark-log

