/**
 * Example of using Lark-log in Koa-app
 **/
'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _Koa = require('Koa');

var _Koa2 = _interopRequireDefault(_Koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var debug = (0, _debug3.default)("lark-log");

var app = new _Koa2.default();

app.use((0, _middleware2.default)());
app.use((function () {
  var ref = _asyncToGenerator(function* (ctx, next) {
    debug("Example: print log with context");
    ctx.logger.notice('This is log');
    debug("Example: print log without context");
    _2.default.instance().notice('This is log 2');
    yield next();
  });

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
})());

app.listen(3000, function () {
  console.log("Koa app listening at 3000...");
});