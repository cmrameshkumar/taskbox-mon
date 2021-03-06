var schema_def = require('../../config/schema.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var txnData = new Schema(schema_def.txnData);

// the schema is useless so far
// we need to create a model using it
var TxnData = mongoose.model('TxnData', txnData);

// make this available to our users in our Node applications
module.exports = TxnData;