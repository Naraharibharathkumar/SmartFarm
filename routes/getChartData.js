/**
 * Created by Bharath Kumar on 5/3/2016.
 */
var ns = require('http');
var geoData = require('./getGeocodeInfo');
var mongoData = require('../mongodb-apiCalls/crudCalls');

exports.getCropData = function(req, res){
    var lat= 45.674564;
    var long= -118.817853;
    geoData.getCountyName(lat, long,res, getCropArea);

};

function getCropArea(res,countyName){
    console.log(countyName);
    mongoData.getAreaData(res,"PENDLETON");
};