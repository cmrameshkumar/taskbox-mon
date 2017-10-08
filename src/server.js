/*globals configs */
'use strict';

global.configs = require('../config/config.json');

var _ = require('lodash');
var koa = require('koa');
var co = require('co');
var http = require('http');
var utils = require('ominto-utils');
//var auth = require('../src/auth/auth');
var os = require('os');
var hostname = os.hostname();
var crypto = require('crypto');
var dbutil = require('./mongoose-util');
var server;
http.globalAgent.maxSockets = 5000;

var environment = process.env.NODE_ENV || process.argv[2] || 'dev';
process.env.NODE_ENV = environment;

var machineHash = crypto.createHash('md5').update(hostname).digest('hex');

function init (id) {
  return new Promise(function (resolve, reject) {

    co(function *() {
      process.on('message', function (msg) {
        console.log('MSG', msg);
        // TODO - if its a "stop" command, then stop listening and kill yourself the cluster way
      });
      process.once('SIGTERM', function () {
        // TODO - stop listening of course, and kill yourself the cluster way
        process.exit(0);
      });
      process.once('SIGINT', function () {
        // TODO - stop listening of course, and kill yourself the cluster way
        process.exit(0);
      });

      var name = id + ':taskbox-mon:api';
      global.log = utils.appLog.createLogger('taskbox-mon', name, configs);
      log.level(configs.logLevel);

      var app = koa();
      app.name = name;
      app.proxy = true;

      app.on('error', function (err, ctx) {
        utils.errorHandler(err, ctx || {}, _.get(ctx, 'state.logger', log));
      });

      app.use(function *(next) {
        try {
          yield next;
        } catch (err) {
          utils.errorHandler(err, this, _.get(this, 'state.logger', log));
        }
      });

      dbutil.initDatabase();

      //Put this after query-param-handler so that this.timeout will be set.
      app.use(function*(next) {
        var ctx = this;
        yield new Promise((resolve, reject) => {
          var timer = setTimeout(function () {
            ctx.body = {error: "timeout"};
            ctx.status = 408;
            resolve();
          }, 300000);
          co(function *() {
            try {
              yield next;
              resolve();
            } catch (err) {
              reject(err);
            } finally {
              clearTimeout(timer);
            }
          });
        });
      });

      // Logging req+res, child logger, X-Request-Id, X-Session-Id
      app.use(function *(next) {
        var start = new Date();

        // create req/session ids if they do not already exist
        var reqId = utils.appendReqId(this.get('X-Request-Id'));
        var sessionId = utils.getSessionId(this.get('X-Session-Id'));

        // create child logger with appropriate fields and set into ctx.state
        var logger = log.child({
          req_id: reqId,
          session_id: sessionId,
          env: environment,
          ip: this.ip,
          method: this.method,
          path: this.path,
          querystring: this.querystring
          // TODO: need req body!
        });
        this.state.logger = logger;

        // verbose json logging via bunyan for cloudwatch, but a simpler and cleaner req/res logger for devlopment
        if (configs.env === 'stage' || configs.env === 'prod') {
          // don't log incoming requests for healthcheck endpoint
          if (!utils.healthcheck.isReqHealthcheck(this)) {
            // otherwise log req (all fields from logger will be logged automatically, e.g. path / ip / method etc.
            logger.info('REQUEST');
          }

          // on finish or close event: log method, url, status, and response time
          var logResponse = function () {
            var responseTime = new Date() - start;
            // don't log outgoing responses for healthcheck endpoint unless an error occurred
            if (!utils.healthcheck.isReqHealthcheck(null, logger) || this.statusCode !== 200) {
              logger.info({
                status: this.statusCode,
                responseTime: responseTime
              }, 'RESPONSE');
            }
          };
          this.res.once('finish', logResponse);
          this.res.once('close', logResponse);
        }

        yield next;

        // set outgoing headers
        this.set('X-Request-Id', reqId);
        this.set('X-Session-Id', sessionId);
      });

      // verbose json logging via bunyan for cloudwatch, but a simpler and cleaner req/res logger for development
      if (configs.env !== 'stage' && configs.env !== 'prod') {
        app.use(require('koa-logger')());
      }

      app.use(require('./routes/router')());

      server = app.listen(configs.port);
      log.info('App listening on port: ', configs.port);
      resolve('Success');
    }).catch(function (err) {
      console.log('Error during init: ', err, err.stack);
      reject(err);
    });
  });
}

function stop () {
  dbutil.closeDatabase();
  server.close();
}

init(environment + machineHash + ":" + process.pid);

module.exports = {
  init: init,
  stop: stop
};
