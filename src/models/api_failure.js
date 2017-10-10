var schema_def = require('../../config/schema.json');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

// create a schema
var apiFailure = new Schema(schema_def.apiFailure);
apiFailure.plugin(mongoosePaginate);

// the schema is useless so far
// we need to create a model using it
var ApiFailure = mongoose.model('ApiFailure', apiFailure);

// make this available to our users in our Node applications
module.exports = ApiFailure;