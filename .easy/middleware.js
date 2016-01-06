/**
 * Lark-log middleware
 **/

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

const debug = (0, _debug3.default)("lark-log");

function middleware() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    debug("Middleware: create middleware");
    const logger = new _2.default(options).saveInstance();
    return (function () {
        var ref = _asyncToGenerator(function* (ctx, next) {
            debug("Middleware: ctx.log enabled!");
            const starttime = Date.now();
            const logid = ctx.state.logid || genLogid();
            ctx.logger = logger;
            debug("Middleware: ctx.log on request");
            ctx.logger.request({
                logid: logid,
                method: ctx.method,
                url: ctx.url,
                headers: ctx.headers
            });
            yield next();
            debug("Middleware: ctx.log on response");
            ctx.logger.response({
                logid: logid,
                status: ctx.status,
                cost: Date.now() - starttime
            });
        });

        return function (_x2, _x3) {
            return ref.apply(this, arguments);
        };
    })();
}

function genLogid() {
    return Date.now() + '' + Math.floor(Math.random() * 1000);
}

debug("Middleware: load!");
exports.default = middleware;
