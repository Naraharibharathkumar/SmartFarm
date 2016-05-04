/**
 * Created by Yassaman on 5/3/2016.
 */

var ns = require('http');
var xml2js = require('xml2js');

exports.getCountyName = function(lat, long,res, callback) {

    // var lat= 37.3352;
    // var long= -121.8811;
    var pathToGo = "/api/block/2010/find?latitude="+ lat+ "&longitude=" + long;
    ns.get({
        host: 'data.fcc.gov',
        path: pathToGo
    }, function doneSending(response) {
        console.log("Received Data and waiting for the end");
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk
        });
        response.on('end', function () {
            console.log('No more data in response');
            var parser = new xml2js.Parser();
            parser.parseString(body, function(err,rslt){

                var countyObjectStr= JSON.stringify(rslt['Response']['County']);
                var stateObjectStr= JSON.stringify(rslt['Response']['State']);

                var finalCountyObj = countyObjectStr.slice(1, countyObjectStr.indexOf("]"));
                var finalStateObj = stateObjectStr.slice(1, stateObjectStr.indexOf("]"));

                var countyStateJsonStr= "{ \"state\" : \"" + JSON.parse(finalStateObj).$.name +
                        "\", \"county\": \"" + JSON.parse(finalCountyObj).$.name + "\" }";
                // console.log(countyStateJsonStr);

                callback(res,JSON.parse(countyStateJsonStr));
            })
        });
        response.on('error', function (errorDisplay) {
            console.log('Problem with request: ${errorDisplay.message}')
        });
    });
};

