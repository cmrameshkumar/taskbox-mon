var schema_def = require('../../config/schema.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var apiResponse = new Schema(schema_def.apiResponse);

// the schema is useless so far
// we need to create a model using it
var ApiResponse = mongoose.model('ApiResponse', apiResponse);

// make this available to our users in our Node applications
module.exports = ApiResponse;