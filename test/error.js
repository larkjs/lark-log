/**
 * Test the log module with default configs and uses
 **/
'use strict';

const debug   = require('debug')('lark-log.test');
const cp      = require('child_process');
const fs      = require('fs');
const path    = require('path');

const LarkLog = require('..');
const Output  = require('../lib/Output');

const config = require('../config/default.js');

debug('loading ...');

describe('instance of LarkLog', () => {

    it('should throw if output is changed', done => {
        const logger = new LarkLog();
        logger.outputs.system = {};
        let error = {};
        try {
            logger.warn('Fake');
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceOf(Error);
        done();
    });

    it('should throw if log file is not writable', done => {
        const logger = new LarkLog();
        let error = {};
        logger.outputs.system.close().then(() => {
            logger.warn('Fake')
            .then(() => {
                error.should.be.an.instanceOf(Error);
                done();
            })
            .catch(error => {
                error.should.be.an.instanceOf(Error);
                done();
            });
        }).catch(error => {
            error.should.not.be.an.instanceOf(Error);
            done();
        });
    });
});

debug('loaded!');