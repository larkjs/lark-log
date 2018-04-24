/**
 * Logger with methods
 **/
'use strict';

const _               = require('lodash');
const assert          = require('assert');
const debug           = require('debug')('lark-log.Logger');
const LarkConfig      = require('lark-config');
const DEFAULT_CONFIG  = require('lark-log/config/default.json');
const Output          = require('./output');


class Logger {

    static get USING_DEFAULT() { return 'using-default'; }
    static get Output() { return Output; }

    constructor(config = {}) {
        debug('construct');
        this._config = new LarkConfig();
        this._outputs = new Map();
        this._methods = new Set();
        this.configure(config);
        // process.on('exit', this.reset.bind(this));
    }

    reset() {
        debug('reset');
        for (const output of this._outputs.values()) {
            output.close();
        }
        for (const method of this._methods.values()) {
            delete this[method];
        }
        this._outputs = new Map();
        this._methods = new Set();
    }

    useDefaultConfig() {
        this.configure({ [Logger.USING_DEFAULT]: true });
    }

    configure(config, tags = []) {
        debug('use config');
        assert(config instanceof Object, 'Invalid logger config, should be an object');
        if (config[Logger.USING_DEFAULT] && !this._config.get(Logger.USING_DEFAULT)) {
            debug('using default configs');
            config = _.defaultsDeep(config, this._config.config, DEFAULT_CONFIG, {});
        }
        delete config[Logger.USING_DEFAULT];
        this._config.use(config, tags);
        prepareOutputs(this);
        prepareMethods(this);
    }
}


function prepareOutputs(logger) {
    debug('prepare outputs');
    const outputsConfig = _.cloneDeep(logger._config.get('outputs') || {});
    assert(outputsConfig instanceof Object, 'Outputs config should be an object');
    const defaultConfig = outputsConfig.default || {};
    delete outputsConfig.default;
    for (const outputName in outputsConfig) {
        const output = logger._outputs.get(outputName) || new Logger.Output();
        output.configure(_.defaultsDeep(outputsConfig[outputName] ||{}, defaultConfig));
        debug(`set output [${outputName}]`);
        logger._outputs.set(outputName, output);
    }
    return logger;
}


function prepareMethods(logger) {
    debug('prepare methods');
    const methodsConfig = logger._config.get('methods') || {};
    assert(methodsConfig instanceof Object, 'Methods config should be an object');
    for (const methodName in methodsConfig) {
        const methodConfig = methodsConfig[methodName];
        if (Number.parseInt(methodConfig.level) < Number.parseInt(logger._config.get('level') || 1)) {
            debug(`define method [${methodName}] to do nothing`);
            logger[methodName] = async () => {};
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
            logger._methods.add(methodName);
        }
    }
}


module.exports = Logger;
