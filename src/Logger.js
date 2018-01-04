/**
 * Logger with methods
 **/
'use strict';

const assert          = require('assert');
const debug           = require('debug')('lark-log.Logger');
const extend          = require('extend');
const LarkConfig      = require('lark-config');
const DEFAULT_CONFIG  = require('lark-log/config/default.json');
const Output          = require('./Output');


class Logger {

    static get USING_DEFAULT() { return 'using-default'; }
    static get Output() { return Output; }

    constructor(config = {}) {
        debug('construct');
        this._config = new LarkConfig();
        this._outputs = new Map();
        this._methods = new Set();
        this.configure(config);
        process.on('exit', () => {
            for (const output of this._outputs.values()) {
                output.close();
            }
        });
    }

    useDefaultConfig() {
        this.configure({ [Logger.USING_DEFAULT]: true });
    }

    configure(config) {
        debug('use config');
        assert(config instanceof Object, 'Invalid logger config, should be an object');
        if (config[Logger.USING_DEFAULT] && !this._config.get(Logger.USING_DEFAULT)) {
            debug('using default configs');
            config = extend(true, {}, DEFAULT_CONFIG, this._config.config, config);
        }
        delete config[Logger.USING_DEFAULT];
        this._config.use(config);
        prepareOutputs(this);
        prepareMethods(this);
    }
}


function prepareOutputs(logger) {
    debug('prepare outputs');
    const outputsConfig = logger._config.get('outputs') || {};
    assert(outputsConfig instanceof Object, 'Outputs config should be an object');
    const defaultConfig = outputsConfig.default || {};
    delete outputsConfig.default;
    for (const outputName in outputsConfig) {
        const output = logger._outputs.get(outputName) || new Logger.Output(defaultConfig);
        output.configure(outputsConfig[outputName] || {});
        debug(`set output [${outputName}]`);
        logger._outputs.set(outputName, output);
    }
    for (const outputName of logger._outputs.keys()) {
        if (!outputsConfig.hasOwnProperty(outputName)) {
            debug(`remove output [${outputName}]`);
            logger._outputs.del(outputName);
        }
    }
    return logger;
}


function prepareMethods(logger) {
    debug('prepare methods');
    const methodsConfig = logger._config.get('methods') || {};
    assert(methodsConfig instanceof Object, 'Methods config should be an object');
    for (const methodName of logger._methods.values()) {
        delete logger[methodName];
    }
    for (const methodName in methodsConfig) {
        const methodConfig = methodsConfig[methodName];
        if (Number.parseInt(methodConfig.level) < Number.parseInt(logger._config.get('level') || 1)) {
            debug(`define method [${methodName}] to do nothing`);
            logger[methodName] = () => {};
        }
        else {
            const outputName = methodConfig.output;
            assert(logger._outputs.has(outputName), `Output [${outputName}] not defined!`);
            const output = logger._outputs.get(outputName);
            debug(`define method [${methodName}]`);
            logger[methodName] = async (...args) => {
                debug(`${methodName}`);
                await output.write({
                    method: methodName,
                    content: args.join(' '),
                });
            };
        }
    }
}


module.exports = Logger;
