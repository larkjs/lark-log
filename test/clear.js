/**
 * Clear the temporary files such as log files printed during testing
 **/
'use strict';

const debug = require('debug')('lark-log.test.clear');
const cp    = require('child_process');
const path  = require('path');

debug('loading ...');

process.mainModule = module;

function clearLogs () {
    debug('clearing logs ...');
    const logsDirectory = path.join(__dirname, 'logs');
    cp.execSync('rm -rf ' + logsDirectory);
};

clearLogs();
process.on('exit', code => clearLogs());

debug('loaded!');
