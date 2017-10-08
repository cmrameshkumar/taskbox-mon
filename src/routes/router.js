"use strict";

const joiRouter = require('koa-joi-router');
const router = joiRouter();
var handler = require('./router-handler');

router.route({
  method: 'GET',
  path: '/tbmon/getFailedTxns',
  handler: handler.getFailedTxns
});

router.route({
  method: 'GET',
  path: '/tbmon/getTxns',
  handler: handler.getTxns
});

router.route({
  method: 'POST',
  path: '/tbmon/saveApiResponse',
  validate: {
    type: 'json'
  },
  handler: handler.saveApiResponse
});

router.route({
  method: 'POST',
  path: '/tbmon/saveApiFailure',
  validate: {
    type: 'json'
  },
  handler: handler.saveApiFailure
});

router.route({
  method: 'POST',
  path: '/tbmon/saveParsingFailure',
  validate: {
    type: 'json'
  },
  handler: handler.saveParsingFailure
});

router.route({
  method: 'POST',
  path: '/tbmon/saveTxnData',
  validate: {
    type: 'json'
  },
  handler: handler.saveParsingFailure
});

function setup () {
  return router.middleware();
}

module.exports = setup;
