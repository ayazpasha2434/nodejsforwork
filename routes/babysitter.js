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

function getISTTime(time) {
    var d = new Date();
    var offset = 5.5; //for IST
    var time = new Date(parseInt(time, 10) + (d.getTimezoneOffset() * 60000) + (3600000 * offset));
    return time.toString().replace('GMT+0200 (CEST)', 'GMT+0530 (IST)');
}

function camelCase(input) {
    return input.replace(/_(.)/g, function(match, group1) {
        console.log(group1+","+match); return group1.toUpperCase();
    });
}

function encodeKey(key) {
    return key.split(".").join("");
}

function decodeKey(key) {
    return key.replace("\\u002e", ".").replace("\\u0024", "\$").replace("\\\\", "\\")
}

var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;

function whatIsIt(object) {
    if (object === null) {
        return "null";
    }
    else if (object === undefined) {
        return "undefined";
    }
    else if (object.constructor === stringConstructor) {
        return "String";
    }
    else if (object.constructor === arrayConstructor) {
        return "Array";
    }
    else if (object.constructor === objectConstructor) {
        return "Object";
    }
    else {
        return "don't know";
    }
}

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

exports.nearest_elderly_care = function(req, res){

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

    db.collection('elderly_care').find(query, projection).toArray(function(err, babySitters) {
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

exports.nearest_nurses = function(req, res){

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

    db.collection('nurses').find(query, projection).toArray(function(err, babySitters) {
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

exports.nearest_maids = function(req, res){

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

    db.collection('maids').find(query, projection).toArray(function(err, babySitters) {
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

exports.nearest_cooks = function(req, res){

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

    db.collection('cooks').find(query, projection).toArray(function(err, babySitters) {
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

exports.import_data = function(req, res){

    var request = require('request');

    var city_list = ["Ahmedabad","Baroda","Bhavnagar","Bhopal","Gwalior","Indore","Jabalpur",
        "Jamnagar","Rajkot","Surat","Raipur","Hubli Dharwad","Mangalore","Mysore",
        "Ambala","Amritsar","Chandigarh","Dehradun","Jalandhar","Ludhiana","Shimla",
        "Coimbatore","Madurai","Kochi","Kozhikode","Tiruchirappalli",
        "Allahabad","Kanpur","Lucknow","Agra","Mathura","Varanasi","Hyderabad","Vijayawada",
        "Visakhapatnam","Ajmer","Jaipur","Jodhpur","Kota","Udaipur","Mumbai","East","Bhubaneshwar",
        "Guwahati","Jamshedpur","Kolkata","Patna","Ranchi","Aurangabad","Nagpur","Nashik","Pune","Solapur","Bangalore",
        "Chennai", "Delhi"
    ];

    function getBabySitters(city, fCallback) {

        require('async').forEach([1,2,3,4,5,6,7,8,9,10], function(item, callb) {

            request('http://t.justdial.com/india_api_read/26june2015/searchziva.php?city='+ city +'&state=&case=spcall&stype=category_list&search=cooks&docid=1000717763&lat=&long=&area=&max=20&rnd1=0.91168&rnd2=0.90195&rnd3=0.80184&basedon=&nearme=&wap=2&login_mobile=&moviedate=2015-11-22&mvbksrc=tp%2Cpvr%2Ccinemax%2Cf&pg_no='+item, function(err, response, body) {

                //request('http://t.justdial.com/india_api_read/26june2015/searchziva.php?city='+ city +'&state=&case=spcall&stype=category_list&search=home%20nursing%20&docid=169223&lat=&long=&area=&max=20&rnd1=0.52607&rnd2=0.54743&rnd3=0.93711&basedon=&nearme=&wap=2&login_mobile=&moviedate=2015-11-22&mvbksrc=tp%2Cpvr%2Ccinemax%2Cf&pg_no='+item, function(err, response, body) {
                //request('http://t.justdial.com/india_api_read/26june2015/searchziva.php?city='+ city +'&state=&case=spcall&stype=category_list&search=Day%20Care%20Centres&docid=1000687732&rnd1=0.92378&rnd2=0.00741&rnd3=0.48715&basedon=&nearme=&wap=2&login_mobile=&moviedate=2015-10-23&mvbksrc=tp%2Cpvr%2Ccinemax%2Cfc&max=50&pg_no='+item, function(err, response, body) {

                if(!err) {

                    try {

                        var resp = JSON.parse(body);

                        if(resp) {

                            var results = resp.results || [];

                            require('async').forEach(results, function(babysitter, callback) {

                                //console.log(''+babysitter.docId);

                                var docId = babysitter.docId;
                                var city = babysitter.city;
                                var thumbnail = babysitter.thumbnail;

                                request('http://t.justdial.com/india_api_read/26june2015/searchziva.php?docid='+ docId +'&case=detail', function(err, response, body) {

                                    try {

                                        var sitter = JSON.parse(body);

                                        if(sitter) {

                                            var result = sitter.results;

                                            for (var key in result) {
                                                if (result.hasOwnProperty(key)) {
                                                    //alert(key + " -> " + result[key]);

                                                    if("Object" == whatIsIt(result[key])) {

                                                        var result_ = result[key];

                                                        for (var key_ in result_) {

                                                            if(key_.indexOf(".") !== -1) {

                                                                console.log(key_+' => '+encodeKey(key_));
                                                                delete result_[key_];
                                                                result_[encodeKey(key_)] = result_[key_];

                                                                result[key] = result_;
                                                            }

                                                        }
                                                    }
                                                }
                                            }

                                            add_to_mongo(docId, city, thumbnail, result, function(err, msg) {

                                                if(err) {

                                                    //console.log(msg + ':' + err)
                                                }

                                                callback;

                                            });

                                        }
                                    } catch (e) {

                                        console.log(e + ' ' + body);
                                        callback;
                                    }



                                });

                            }, function(err) {

                                callb;

                            });

                        } else {
                            console.log('Improper response: '+ resp);

                        }
                    } catch(e) {
                        callb;
                    }

                } else {

                    console.log(err);
                }

            });

        }, function(err) {

            fCallback;
        });
    }

    function finalCallback(err) {

        if(!err) {

            console.log('Error: '+err);
        } else {
            console.log('Done!');
            res.send('Done!');
        }

    }

    require('async').forEach(city_list, getBabySitters, finalCallback);
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

function add_to_mongo(docId, city, thumbnail, params, callback) {

    var parameters = params;
    parameters['updatedAt'] = getISTTime(new Date().getTime());

    parameters['city'] = city;
    parameters['thumbnail'] = thumbnail;

    var query = { '_id': docId };
    var options = { 'upsert': true };

    try {

        if(db != undefined) {

            db.collection('cooks').find({_id: docId}).toArray(function(err, sitters) {

                if(!err) {

                    if(sitters.length == 0)
                        parameters['createdTS'] = new Date().getTime();
                    else {

                        if(sitters[0] != undefined) {

                            var bData = sitters[0];

                            if(bData._id)
                                parameters['updatedTS'] = new Date().getTime();
                        }
                    }

                    var operator = {
                        $currentDate: {
                            lastModified: true,
                            lastModifiedTstamp: { $type: "timestamp" }
                        },
                        '$set': parameters
                    };

                    //console.log("elderly_care/insertOrUpdate "+JSON.stringify(query)+" "+JSON.stringify(operator)+" "+JSON.stringify(options));

                    db.collection('cooks').update(query, operator, options, function(err, upserted) {
                        if (err) {
                            throw err;
                            callback(err);
                        } else {
                            callback();
                        }
                    });


                } else
                    callback(err);
            });

        } else {
            MongoClient.connect('mongodb://127.0.0.1:27017/babysitter', function(err, dbc) {
                if(err) { throw err; callback(err); }

                dbc.collection('cooks').find({_id: docId}).toArray(function(err, sitters) {

                    if(!err) {

                        if(sitters.length == 0)
                            parameters['createdTS'] = new Date().getTime();
                        else {
                            if(sitters[0] != undefined) {

                                var bData = sitters[0];

                                if(bData.docId)
                                    parameters['updatedTS'] = new Date().getTime();
                            }

                        }

                        var operator = {
                            $currentDate: {
                                lastModified: true,
                                lastModifiedTstamp: { $type: "timestamp" }
                            },
                            '$set': parameters
                        };

                        //console.log("elderly_care/insertOrUpdate "+JSON.stringify(query)+" "+JSON.stringify(operator)+" "+JSON.stringify(options));

                        dbc.collection('cooks').update(query, operator, options, function(err, upserted) {
                            if (err) {
                                throw err;
                                callback(err);
                            } else {
                                callback();
                            }
                        });

                    } else
                        callback(err);

                });

            });
        }

    } catch (e) {
        console.error("cooks/insertOrUpdate Error: "+e);
        callback(e);
    }
}
