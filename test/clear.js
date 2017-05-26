/**
 * Clear the temporary files such as log files printed during testing
 **/
'use strict';

const cp    = require('child_process');
const path  = require('path');

process.mainModule = module;

function clearLogs () {
    const logsDirectory = path.join(__dirname, 'logs');
    cp.execSync('rm -rf ' + logsDirectory);
};

clearLogs();
process.on('exit', code => clearLogs());
