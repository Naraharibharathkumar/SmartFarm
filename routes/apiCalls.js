/**
 * Created by Bharath Kumar on 4/29/2016.
 */
var http = require('http');
var request = require('request');


var jsonObj = JSON.stringify({
    "EnvironmentVariableName": "CropScape",
    "Domain": {
        "Mask": "None",
        "SpatialRegionType": "CellGrid",
        "Lats": [ 29.1462, 30.348708333333335, 30.551116666666665, 30.753525 ],
        "Lons": [ -88.4743, -88.32506666666667, -88.17583333333333, -88.0266 ],
        "Lats2": "None",
        "Lons2": "None",
        "TimeRegion": {
            "Years": [ 2013,2014,2015 ],
            "Days": [ 1, 366 ],
            "Hours": [ 0, 24 ],
            "IsIntervalsGridYears": false,
            "IsIntervalsGridDays": true,
            "IsIntervalsGridHours": true
        }
    },
    "ParticularDataSources": {},
    "ReproducibilityTimestamp": 253404979199999
});

exports.getData = function(req, res) {
    function waitForData(result){
        if(result.indexOf("completed") > -1) {
            console.log("Hello")
            return result;
        }
        else{
            try{
                var newVar = result[result.indexof("hash=") + 5];
            }
            catch(ex){
                console.log("Oops: result :"+result);
                console.log(ex.message.toString());
            }
            http.get("http://fetchclimate2-dev.cloudapp.net/api/status?hash=" + newVar,function(err, rslt){
                if(err){
                    console.log(err.message.toString());
                }
                else{
                    if(rslt.indexOf("completed") > -1)
                        return rslt.toString();
                }
            });
        }
    };
/*
    function getNewData(query){
        //var newVar = query[query.indexOf("Blob=") + 5];
        var newVar = "1fd083ad0549a8e3dcf0e3f6109eabb2a41f1441";
        http.get("http://fetchclimate2-dev.cloudapp.net/jsproxy/data?uri=msds:ab?AccountName=fc2cache&Container=requests&Blob=1fd083ad0549a8e3dcf0e3f6109eabb2a41f1441&variables=lat,lon,values"
            ,function(err,rslt){
                if(err){
                    console.log("Here1")
                    console.log(err);
                }
                else{
                    if(rslt.indexOf("completed") > -1){
                        console.log("Here")
                        console.log(rslt);
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(rslt));
                    }
                }
        });
    }
*/
    function getNewData(query){
        console.log('Hello')
        request.get('http://fetchclimate2-dev.cloudapp.net/jsproxy/data',{
                qs: {uri: "msds:ab?AccountName=fc2cache&Container=requests&Blob=1fd083ad0549a8e3dcf0e3f6109eabb2a41f1441&variables=lat,lon,values"}},
            function(error, response, body){
                if(error)
                    console.log(error);
                else
                    console.log(body);
            });
    }

    function computeData(){
        var url_details = {
            host: 'fetchclimate2-dev.cloudapp.net',
            port: '80',
            path: '/api/compute',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObj.length)
            }
        };
        console.log("Hello")
        var b = request.post({
            headers: {'content-type' : 'application/json'},
            url:     'http://fetchclimate2-dev.cloudapp.net/api/compute',
            body:    jsonObj
        }, function(error, response, body){
            console.log(jsonObj);
            console.log(body);
            //waitForData(body);
        });
    }
    computeData();
    //query = waitForData(query)
    //getNewData("Hello");
}
