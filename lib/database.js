var mongoconn = require('mongodb');
var MongoClient = mongoconn.MongoClient;
var url = 'mongodb://localhost:27017/windy';

module.exports.init = function() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            db.collection('spots', function (err, coll) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve({db: db, spots: coll});
                }
            });
        })
    });
};