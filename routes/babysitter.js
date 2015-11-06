/**
 * Created by ayaz on 9/9/15.
 */

var MongoClient = require('mongodb').MongoClient,
    db = MongoClient.connect('mongodb://127.0.0.1:27017/babysitter', function(err, dbc) {
        if(err) throw err;
        db = dbc;
    });

Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};

exports.nearest_baby_sitters = function(req, res){

    var result = [];
    var nearestDriversInfo = {};
    var limit = req.query.number || 15;
    var distance_limit = req.query.distance || 5;

    var sortBy = req.query.sort_by || 'distance';

    console.log("Getting " + req.query.number +
    " baby sitters close to lat = " + req.query.latitude +
    " & long =" + req.query.longitude);

    var lat = parseFloat(req.query.latitude);
    var lon = parseFloat(req.query.longitude);

    var query = {};

    var projection  = { "complat": 1, "complong": 1, "phone": 1, "address": 1, "name": 1, "YOE": 1, "Reviews": 1, "HoursOfOperation": 1, "totalReviews": 1, "Catalogue": 1, "overallRatingsChart": 1, "rating": 1 };

    db.collection('babysitters').find(query, projection).toArray(function(err, babySitters) {
        if(err) throw err;

        require("async").forEach(babySitters, function (babySitterObj, callback) {
            var lat1 = parseFloat(babySitterObj["complat"]);
            var long1 = parseFloat(babySitterObj["complong"]);

            var distance = get_radial_distance(lat, lon, lat1, long1);

            if (distance <= distance_limit) {

                var year_of_est = babySitterObj.YOE + "";

                result.push({
                    "name": babySitterObj.name,
                    "distance": distance,
                    "year_of_est": year_of_est,
                    "address": babySitterObj.address,
                    "phone": babySitterObj.phone,
                    "latitude" : lat1,
                    "longitude" : long1,
                    "category": babySitterObj.categories,
                    "id": babySitterObj._id,
                    "reviews": babySitterObj.Reviews,
                    "hoursOfOperation": babySitterObj.HoursOfOperation,
                    "totalReviews": babySitterObj.totalReviews,
                    "catalogue": babySitterObj.Catalogue,
                    "overallRatingsChart": babySitterObj.overallRatingsChart,
                    "rating": babySitterObj.rating
                });
            }

            callback();

        }, function(err) {

            if(err) {
                throw err;
            }

            result.sort(function(a, b) {
                return a[sortBy] - b[sortBy];
            });

            result = result.slice(0, limit);

            res.send(result);

            /*nearestDriversInfo['distance'] = distance_limit;
            nearestDriversInfo['booking_id'] = req.query.booking_id || "";
            nearestDriversInfo['latitude'] = lat;
            nearestDriversInfo['longitude'] = lon;
            nearestDriversInfo['sort_by'] = sortBy;
            nearestDriversInfo['city'] = city;
            nearestDriversInfo['drivers'] = result;
            nearest_drivers.insertNearestDrivers(nearestDriversInfo);*/
        });

    });
};

function get_radial_distance(lat1, long1, lat2, long2) {
    // return radial distance between two points
    var R = 6371; // km
    var dLat = (lat1 - lat2).toRad();
    var dLon = (long1 - long2).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) *
        Math.cos(lat2.toRad()) * Math.cos(lat1.toRad());
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    var distance = Math.round(d * Math.pow(10, 2)) / Math.pow(10, 2);
    return distance;
}
