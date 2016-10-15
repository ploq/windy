var process = require("process");

var mongodb = require("./lib/database").init();
var sqlite3 = require("sqlite3").verbose();
var file = "spots.db";
var sqldb = new sqlite3.Database(file);

var spots;


var listSpots = function (db, cb) {
    db.all("SELECT * FROM spots", function (err, rows) {
        if (typeof rows === "undefined" || rows.length === 0) {
            cb(err, {})
        }
        console.log("SQL database has", rows.length, " rows");
        rows = rows.map(function(spot) {
            spot.coords = { "type": "Point",
                "coordinates": [Number(spot.longitude), Number(spot.latitude)]};
            spot.directions = spot.directions.split(",");

            delete spot.latitude;
            delete spot.longitude;

            return spot;
        });
        console.log("Done converting from SQLite to JSON objects!");
        cb(err, rows);
    });
};

var addSpots =  new Promise(function(resolve) {
    mongodb.then(function(dbobj){
        console.log("Connected to database!");
        listSpots(sqldb, function(err, rows){
            console.log("Adding spots to mongodb...");
            dbobj.spots.insertMany(rows, function() {
                dbobj.spots.createIndex({"coords": "2dsphere"}, function(err) {
                    return resolve(dbobj.db);
                });
            });
        });
    });
});

addSpots.then(function(db){
    db.close();
    console.log("Finished!");
});

/* find within 100km radius
 db.getCollection('spots').find({
 coords: {
 $geoWithin :
 { $center :
 [[57.92, 11.73972222], 100/3963.2]}}})
 */