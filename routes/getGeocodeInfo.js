/**
 * Created by Yassaman on 5/3/2016.
 */

var ns = require('http')
var path = process.argv.slice(2)

exports.getCountyName = function(lat, long, callback) {
    // var lat= 37.5202;
    // var long= -122.2758;
    var countyName= "";
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

            console.log(body)

            var xml2js = require('xml2js');
            var parser = new xml2js.Parser();
            parser.parseString(body, function(err,rslt){

                var countyObjectStr= JSON.stringify(rslt['Response']['County']);

                var startIndex= countyObjectStr.indexOf("name");
                var dirtyCountyName= countyObjectStr.substring(startIndex+7)
                var endIndex= dirtyCountyName.indexOf("\"");

                // console.log(countyObjectStr);
                // console.log(dirtyCountyName.substring(0, endIndex));

                countyName= dirtyCountyName.substring(0, endIndex);
            })
        });
        response.on('error', function (errorDisplay) {
            console.log('Problem with request: ${errorDisplay.message}')
        });
    });
    
    callback(countyName);
};

