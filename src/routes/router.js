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
  handler: handler.saveTxnData
});

router.route({
  method: 'POST',
  path: '/tbmon/updateTxnData',
  validate: {
    type: 'json'
  },
  handler: handler.updateTxnData
});

router.route({
  method: 'DELETE',
  path: '/tbmon/removeTxnData',
  validate: {
    type: 'json'
  },
  handler: handler.removeTxnData
});

router.route({
  method: 'GET',
  path: '/tbmon/getAllTxnData',
  handler: handler.getAllTxnData
});

router.route({
  method: 'GET',
  path: '/tbmon/getTxnDataByJobId/:jobid',
  handler: handler.getTxnDataByJobId
});

router.route({
  method: 'GET',
  path: '/tbmon/getTxnDataBtwnDates/:from/:to',
  handler: handler.getTxnDataBtwnDates
});

router.route({
  method: 'GET',
  path: '/tbmon/getTxnData/:page/:limit',
  handler: handler.getTxnDataByPage
});

function setup () {
  return router.middleware();
}
 
module.exports = setup;
