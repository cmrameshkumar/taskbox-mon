var mongoose = require('mongoose');
var db;

function initDatabase() {
    var promise = mongoose.connect(configs.dbconf.uri, configs.dbconf.options); //default connection pool size is 100 

    promise.then(database => {
        log.info('Mongo connection successful.');
        db = database;
    }).catch(err => { 
        log.error('Unable to connect to the mongo database.', err)
        process.exit(1);
    });
}

function closeDatabase(){
    log.info('Database connection closed.');
    database.close();
}

function save(data){
    return new Promise((resolve, reject) => {
        return data.save(function(err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = {
    initDatabase:initDatabase,
    save:save
};