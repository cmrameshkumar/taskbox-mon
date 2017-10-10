var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db;

//Required to set, this options will be applied for all the mongo queries
// mongoosePaginate.paginate.options = { 
//     lean:  true,
//     limit: 20
//   };

/**
 * Helper method to intialize the database and configure the native promise to the mongoose
 */
function initDatabase() {
    var promise = mongoose.connect(configs.dbconf.uri, configs.dbconf.options); //default connection pool size is 100 

    mongoose.Promise = global.Promise;

    promise.then(database => {
        log.info('Mongo connection successful.');
        db = database;
    }).catch(err => { 
        log.error('Unable to connect to the mongo database.', err)
        process.exit(1);
    });
}

/**
 * Helper method to close the database connection
 */
function closeDatabase(){
    log.info('Database connection closed.');
    database.close();
}

/**
 * Method to insert a document into db
 * @param {*} model 
 * @returns object //inserted document
 */
function save(model){

    return model.save(function(err, result) {
        if(err) {
            log.error("Unable to save the document("+data.collection.collectionName+")", model);
            throw err;
        }
        log.info("Document("+model.collection.collectionName+") saved successfully!", result);
        return result;
    });
}

/**
 * Method to update a document into db
 * @param {*} condition     //search criteria
 * @param {*} model         //table reference
 * @param {*} update        //changed data
 * @returns object          //modified object
 */
function update(condition, model, update){

    return new Promise((resolve, reject) => {
        model.findOneAndUpdate(condition, update, {new: true}, function(err, result){
            if(err) {
                log.error("Unable to update the document("+model.name+")", update);
                return reject(err);
            }
            log.info("Document("+model.collection.name+") updated successfully!", result);

            return resolve(result);
        });
    });
}

/**
 * Mothod to remove a document from the db
 * @param {*} condition //search criteria
 * @param {*} model     //table reference
 * @returns object      //removed object
 */
function remove(condition, model){
    return new Promise((resolve, reject) => {
        model.findOneAndRemove(condition, function(err, result){
            if(err) {
                log.error("Unable to delete the document("+model.name+")", condition);
                return reject(err);
            }
            log.info("Document("+model.collection.name+") deleted successfully!", result);
            return resolve(result);
        });
    });    
}

/**
 * Mothod to get a document from the db
 * @param {*} condition //search criteria
 * @param {*} model     //table reference
 * @returns object      //list of documents 
 */
function findOne(condition, model){
    return model.find(condition, function(err, result){
        if(err) {
            log.error("Unable to get all the documents("+data.collection.collectionName+")", model);
            throw err;
        }
        log.info("Documents("+model.collection.collectionName+") for query("+condition+")!", result);
        return result;
    }); 
}

/**
 * Mothod to find all documents from the db table
 * @param {*} model     //table reference
 * @param {*} sorting   //sorting rule
 * @returns object      //list of documents
 */
function findAll(model, sorting){
    return model.find().sort(sorting).exec(function(err, result){
        if(err) {
            log.error("Unable to get all the documents("+data.collection.collectionName+")", model);
            throw err;
        }
        log.info("All Documents("+model.collection.collectionName+")!", result);
        return result;
    }); 
}

/**
 * Method to retrieve all documents with pagination
 * @param {*} model 
 * @param {*} sorting 
 * @param {*} pageidx 
 * @param {*} pagelimit 
 * @returns Object //List of documents
 */
function getDocsByPage(condition, model, sorting, pageidx, pagelimit){

    var options = {
        sortBy: { datetime: -1 },
      page: pageidx, 
      limit: pagelimit
    };

    if(sorting != undefined){
        options.sort = sorting;
    }

    console.log(options);
    
    return model.paginate(condition, options).then(function(result){
        log.info("Documents("+model.collection.collectionName+") for query("+condition+")!", result);
        return result;
    }).catch(function(err){
        log.error("Unable to get all the documents("+model.collection.collectionName+")", model);
        throw err;
    });
}

/**
 * Mothod to find documents from the db table
 * @param {*} model 
 * @param {*} column 
 * @param {*} from 
 * @param {*} to 
 * @returns Objects //list of documents
 */
function findBetweenTwoDates(model, column, from, to){

    //var cStr = '{"'+column+'" : {"$gte":"", "$lt":""}}';
    var cStr = '{"'+column+'" : {"$gte":"", "$lt":""}}';
    var sStr = '{"'+column+'" : -1}';

    var condition = JSON.parse(cStr);
    var key = Object.keys(condition)[0];
    condition[key].$gte = from;
    condition[key].$lt = to;
    var sorting = JSON.parse(sStr);

    return model.find(condition).sort(sorting).exec(function(err, result){
        if(err) {
            log.error("Unable to get all the documents("+data.collection.collectionName+")", model);
            throw err;
        }
        log.info("All Documents("+model.collection.collectionName+")!", result);
        return result;
    });
}

module.exports = {
    initDatabase:initDatabase,
    save:save,
    update:update,
    remove:remove,
    findAll:findAll,
    findOne:findOne,
    findBetweenTwoDates:findBetweenTwoDates,
    getDocsByPage:getDocsByPage
};