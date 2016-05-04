/**
 * Created by Yassaman on 5/3/2016.
 */

var ns = require('http');
var xml2js = require('xml2js');

exports.getCountyName = function(lat, long,res, callback) {
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
                var finalObj = countyObjectStr.slice(1, countyObjectStr.indexOf("]"));
                callback(res,JSON.parse(finalObj).$.name);
            })
        });
        response.on('error', function (errorDisplay) {
            console.log('Problem with request: ${errorDisplay.message}')
        });
    });
};

