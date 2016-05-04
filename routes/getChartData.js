/**
 * Created by Bharath Kumar on 5/3/2016.
 */
var ns = require('http');
var geoData = require('./getGeocodeInfo');
var mongoData = require('../mongodb-apiCalls/crudCalls');

exports.getCropData = function(req, res){
    var lat= 37.3352;
    var long= -121.8811;
    geoData.getCountyName(lat, long,res, getCropArea);
};

function getCropArea(res,countyName){
    var locationName ={ "state" : "CALIFORNIA", "county" : "PENDLETON"};
    mongoData.getAreaData(res, locationName);
};