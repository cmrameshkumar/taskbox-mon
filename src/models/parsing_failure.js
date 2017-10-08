schema_def = require('../../config/schema.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var parsingFailure = new Schema(schema_def.parsingFailure);

// the schema is useless so far
// we need to create a model using it
var ParsingFailure = mongoose.model('ParsingFailure', parsingFailure);

// make this available to our users in our Node applications
module.exports = ParsingFailure;