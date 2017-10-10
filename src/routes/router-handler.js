var dbutil = require('../mongoose-util');
var ApiResponse = require('../models/api_response');
var TxnData = require('../models/txn_data');
var ApiFailure = require('../models/api_failure');
var ParsingFailure = require('../models/parsing_failure');

//Upon node version upgrade, generators to be replaced with async/await
function* getTxns() {
    console.log('Get transactions method invoked.');
    log.info('Get transactions method invoked.');
    return this.status = 200;
}

function* getFailedTxns() {
    console.log('Get failed transactions method invoked.');
    log.info('Get failed transactions method invoked.');
    return this.status = 200;
}

/**
 * Method to save api response to the monitoring database
 */
function* saveApiResponse() {
    var message = this.request.body;
    
    log.info('Saving response from affiliate API', message);

    var apiResponse = new ApiResponse(message);
    
    yield dbutil.save(apiResponse);
    
    return this.status = 200;
}

/**
 * Method to save api failure to monitoring database
 */
function* saveApiFailure() {

    var message = this.request.body;

    log.info('Saving affiliate API invocation failure', message);

    var apiFailure = new ApiFailure(message);
    
    yield dbutil.save(apiFailure);
    
    return this.status = 200;
}

/**
 * Method to save parsing failure to monitoring database
 */
function* saveParsingFailure() {

    var message = this.request.body;
    
    log.info('Saving affiliate API response parsing failure', message);

    var parsingFailure = new ParsingFailure(message);
    
    yield dbutil.save(parsingFailure);

    return this.status = 200;
}

/**
 * Method to save transaction data to monitoring database
 */
function* saveTxnData() {

    var message = this.request.body;
    
    log.info('Saving transaction data', message);
    
    message.datetime = new Date();

    var txnData = new TxnData(message);
    
    var result = yield dbutil.save(txnData);

    this.body = result;

    this.status = 200;
}

/**
 * Method to update transaction data in monitoring database
 */
function* updateTxnData() {
    
    var message = this.request.body;
    
    log.info('Update transaction data', message);
    
    var result = yield dbutil.update({job_id: message.job_id}, TxnData, message);

    this.body = result;

    this.status = 200;
}

/**
 * Method to remove transaction data from monitoring database
 */
function* removeTxnData() {
    
    var message = this.request.body;
    
    log.info('Delete transaction data', message);
    
    yield dbutil.remove({job_id: message.job_id}, TxnData);

    this.status = 200;
}

/**
 * Method to get all transaction data from monitoring database
 */
function* getAllTxnData() {
    
    log.info('Get all transaction data');
    
    var result = yield dbutil.findAll(TxnData, {datetime:-1});

    this.body = result;

    this.status = 200;
}

/**
 * Method to get transaction data for the given jobid from monitoring database
 */
function* getTxnDataByJobId() {

    var jobid = this.request.params.jobid;
    
    log.info('Get transaction data by job id', jobid);
    
    var result = yield dbutil.findOne({job_id:jobid}, TxnData);

    this.body = result;

    this.status = 200;
}

/**
 * Method to get transaction data for the given jobid from monitoring database
 */
function* getTxnDataBtwnDates() {
    
    var from = new Date(Number(Date.parse(this.request.params.from)));

    var to = new Date(Number(Date.parse(this.request.params.to)));
    
    log.info('Get transaction data between dates', from+':'+to);
    
    var result = yield dbutil.findBetweenTwoDates(TxnData, 'datetime', from, to);

    this.body = result;

    this.status = 200;
}

/**
 * Method to get transaction data for the given jobid from monitoring database
 */
function* getTxnDataByPage() {
    
    var pageidx = this.request.params.page;

    var limit = this.request.params.limit;
    
    log.info('Get transaction data by page', pageidx+':'+limit);
    
    var result = yield dbutil.getDocsByPage({}, TxnData, {datetime:-1}, parseInt(pageidx), parseInt(limit));

    this.body = result;

    this.status = 200;
}

module.exports = {
    getFailedTxns: getFailedTxns,
    getTxns: getTxns,
    saveApiResponse: saveApiResponse,
    saveApiFailure: saveApiFailure,
    saveParsingFailure: saveParsingFailure,
    saveTxnData: saveTxnData,
    updateTxnData: updateTxnData,
    removeTxnData: removeTxnData,
    getAllTxnData: getAllTxnData,
    getTxnDataByJobId: getTxnDataByJobId,
    getTxnDataBtwnDates: getTxnDataBtwnDates,
    getTxnDataByPage: getTxnDataByPage
};