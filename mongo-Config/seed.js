/**
 * Created by Bharath Kumar on 5/3/2016.
 */
var mongoose    = require('mongoose');
var config      = require('./mongoConnect'); // get db config file
var area     = require('../mongo-models/AreaData-model');
var price = require('../mongo-models/PriceData-model');

mongoose.createConnection(config.database);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

exports.insertPriceData = function(jsonObj){
    price.collection.insert(jsonObj,onInsert);
};

exports.insertAreaData = function(jsonObj){
    area.collection.insert(jsonObj,onInsert);
};

function onInsert(err,docs) {
    if(err)
    {
        console.log('error :' +err);
    }
    else
    {
        console.log("data inserted successfully");
    }
}
