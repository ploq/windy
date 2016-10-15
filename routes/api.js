var express = require('express');
var mongodb = require("../lib/database").init();


module.exports = (function() {
    'use strict';
    var api = express.Router();
    api.get("/v1/spots/:lat/:lng/:radius", function(req,res) {
        var lat = Number(req.params.lat);
        var lng = Number(req.params.lng);
        var radius = Number(req.params.radius);

        mongodb.then(function(dbobj) {
            dbobj.spots.find({coords: {$near : {
                $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: radius}}},
                { _id: 0, range: 0 }).toArray(function(err, rows) {
                    console.log(err);
                    res.send(JSON.stringify(rows));
            });
        });
    });
    return api;
})();