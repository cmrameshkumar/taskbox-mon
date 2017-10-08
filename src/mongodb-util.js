var MongoClient = require('mongodb').MongoClient,
f = require('util').format,
assert = require('assert');

var uri = configs.dbconf.uri;
var user = encodeURIComponent(configs.dbconf.user);
var pass = encodeURIComponent(configs.dbconf.pass);
var authMechanism = 'DEFAULT';

var url = f(uri, user, pass, authMechanism);
var mongodb;

function initDatabase(){
    
    MongoClient.connect(url, {
        poolSize:configs.dbconf.poolSize, 
        connectTimeoutMS: configs.dbconf.timeout,
    }, 
    function(err, db) {
        if (err) {
            log.error('Unable to connect to database.');
        }
    
        db.createCollection("txn_data", function(err, res) {
            if (err) {
                log.error('Unable to create Transaction Data collection.', err);
                throw err;
            }
            log.info("Transaction Data collection created!");
        });

        db.createCollection("api_failure", function(err, res) {
            if (err) {
                log.error('Unable to create Transaction Data collection.', err);
                throw err;
            }
            log.info("Api failure collection created!");
        });

        db.createCollection("parsing_failure", function(err, res) {
            if (err) {
                log.error('Unable to create Transaction Data collection.', err);
                throw err;
            }
            log.info("Parsing failure collection created!");
        });

        mongodb = db;  
    });
}

function closeDatabase(){
    log.info('Database connection closed.');
    mongodb.close();
}

function save(collection, data){
    console.log(mongodb);
    return new Promise((resolve, reject) => {
        mongodb.collection(collection).insertOne(data, function(err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
          });
    });
}

module.exports = {
    initDatabase:initDatabase,
    save:save
};