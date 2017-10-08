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

function* saveApiResponse() {
    var message = this.request.body;
    
    log.info('Saving response from affiliate API', message);

    var apiResponse = new ApiResponse(message);
    
    yield dbutil.save(apiResponse).then(text => {
        log.info("Api response saved", text);
    })
    .catch(error => {
        log.error("Unable to save the Api response", error);
        throw error;
    });
    
    return this.status = 200;
}

function* saveApiFailure() {

    var message = this.request.body;

    log.info('Saving affiliate API invocation failure', message);

    var apiFailure = new ApiFailure(message);
    
    yield dbutil.save(apiFailure).then(text => {
        log.info("Api failure saved", text);
    })
    .catch(error => {
        log.error("Unable to save the Api failure", error);
        throw error;
    });
    
    return this.status = 200;
}

function* saveParsingFailure() {

    var message = this.request.body;
    
    log.info('Saving affiliate API response parsing failure', message);

    var parsingFailure = new ParsingFailure(message);
    
    yield dbutil.save(parsingFailure).then(text => {
        log.info("Parsing failure saved", text);
    })
    .catch(error => {
        log.error("Unable to save the parsing failure", error);
        throw error;
    });

    return this.status = 200;
}

/**
 * Method to save the transaction data to the monitoring database
 */
function* saveTxnData() {

    var message = this.request.body;
    
    log.info('Saving transaction data', message);

    var txnData = new ParsingFailure(message);
    
    yield dbutil.save(txnData).then(text => {
        log.info("Parsing failure saved", text);
    })
    .catch(error => {
        log.error("Unable to save the parsing failure", error);
        throw error;
    });

    return this.status = 200;
}

module.exports = {
    getFailedTxns: getFailedTxns,
    getTxns: getTxns,
    saveApiResponse: saveApiResponse,
    saveApiFailure: saveApiFailure,
    saveParsingFailure: saveParsingFailure,
    saveTxnData: saveTxnData
};