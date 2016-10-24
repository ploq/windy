var express = require('express');
var mongodb = require("../lib/database").init();


module.exports = (function() {
    'use strict';
    var api = express.Router();
    api.get("/v1/spots/:lat/:lng/:radius/:directions?", function(req,res) {
        var lat = Number(req.params.lat);
        var lng = Number(req.params.lng);
        var radius = Number(req.params.radius);
        var directions = req.params.directions;

        var mongo_query = {coords: {$near : {
            $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: radius}}};

        if (typeof directions !== "undefined") {
            try {
                directions = JSON.parse(directions);
            } catch (e) {
                console.log(e);
                res.send("{}");
                return;
            }
            console.log(directions);
            if(Array.isArray(directions))
                mongo_query.directions = {"$in": directions}
        }

        console.log(mongo_query);

        mongodb.then(function(dbobj) {
            dbobj.spots.find(mongo_query,
                { _id: 0, range: 0 }).toArray(function(err, rows) {
                    if (err) {
                        console.log(err);
                        res.send("[]");
                    } else {
                        res.send(JSON.stringify(rows));
                    }
            });
        });
    });
    return api;
})();