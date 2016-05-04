/**
 * Created by Bharath Kumar on 5/3/2016.
 */

var getMongoClient = require('../mongo-Config/connectMongo');

exports.getAreaData = function(res, countyName, callback){
    var mongoDbObj = getMongoClient.mongoDbObj();
    var result = getDistinctCrops(res, mongoDbObj, countyName, callback);
};

function getAverageArea(res,result, rslt){
    var k = 0;
    var jsonArray = [];
    var avg = 0;
    console.log(result)
    console.log(rslt)
    for(var i = 0 ; i < result.length ; i++){
        for(var j = 0; j < rslt.length; j++) {
            if (rslt[j].commodity_desc == result[i]) {
                k++;
                avg = avg + parseInt(rslt[j].value.replace(/[^0-9]/g, ''));
                console.log(avg)
            }
        }
        avg = avg/k;
        k = 0;
        jsonArray.push({"cropName" : result[i], "cropAcres" : avg});
        avg = 0;
    }
    if(i==result.length){
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonArray);
    }

}

function getCropAreaData(res,mongoDbObj, countyName,result, callback){
    mongoDbObj.areaSchema.find({$and: [{county_name: countyName}]},{_id:0,value:1,commodity_desc:1}).toArray(function(err, rslt){
        if(err){
            throw err;
        }
        else{
            if(rslt.length > 0){
                getAverageArea(res,result, rslt);
            }
            else{
                console.log("could not get data");
            }
        }

    });
}

function getDistinctCrops(res,mongoDbObj, countyName, callback){
    mongoDbObj.areaSchema.distinct("commodity_desc" , { "county_name": countyName } ,function(err,result){
        if(err){
            throw err;
        }
        else{
            if(result.length > 0){
                getCropAreaData(res,mongoDbObj,countyName, result, callback);
            }
        }
    })
}

exports.insertPriceData = function(jsonObj, res){
    var mongoDbObj = getMongoClient.mongoDbObj();
    console.log(jsonObj)
    for(var i=0;i<jsonObj.length;i++){
        mongoDbObj.priceSchema.insert(jsonObj[i],{w:1},function(err, result){
            if(err){
                //res.write('Unable to write Data');
                //res.end();
            }
            else{
                //res.write('Data Success');
                //res.end();
            }
        });
    }
};

exports.insertAreaData = function(jsonObj, res){
    var mongoDbObj = getMongoClient.mongoDbObj();
    console.log(jsonObj)
    for(var i=0;i<jsonObj.length;i++){
        mongoDbObj.areaSchema.insert(jsonObj[i],{w:1},function(err, result){
            if(err){
                //res.write('Unable to write Data');
                //res.end();
            }
            else{
                //res.write('Data Success');
                //res.end();
            }
        });
    }
};
