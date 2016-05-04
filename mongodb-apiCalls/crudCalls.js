/**
 * Created by Bharath Kumar on 5/3/2016.
 */

var getMongoClient = require('../mongo-Config/connectMongo');

exports.getAreaData = function(res, countyName){
    var mongoDbObj = getMongoClient.mongoDbObj();
    getDistinctCrops(res, mongoDbObj, countyName);
};


function getDistinctCrops(res, mongoDbObj, countyName){
    mongoDbObj.areaSchema.distinct("commodity_desc" , { "county_name": countyName } ,function(err,result){
        if(err){
            throw err;
        }
        else{
            if(result.length > 0){
                getCropAreaData(res, mongoDbObj, countyName, result);
            }
        }
    })
}


function getCropAreaData(res,mongoDbObj, countyName,result){
    mongoDbObj.areaSchema.find({$and: [{county_name: countyName}]},{_id:0,value:1,commodity_desc:1}).toArray(function(err, rslt){
        if(err){
            throw err;
        }
        else{
            if(rslt.length > 0){
                getAverageArea(res,mongoDbObj, countyName, result, rslt);
            }
            else{
                console.log("could not get data");
            }
        }

    });
}

function getAverageArea(res, mongoDbObj, countyName, result, rslt){
    var k = 0;
    var jsonArray = [];
    var avg = 0;
    result.forEach(function(childResult){
        rslt.forEach(function(childRslt){
            if(childRslt.commodity_desc == childResult){
                k++;
                avg = avg + parseInt(childRslt.value.replace(/[^0-9]/g, ''));
            }
        });
        avg = avg/k;
        k = 0;
        jsonArray.push({"cropName" : childResult, "cropAcres" : avg});
        avg = 0;
    });
    getCropPriceData(res, mongoDbObj, countyName, result, jsonArray);
}

function getCropPriceData(res, mongoDbObj, countyName, result, jsonArray){
    var cropPriceData = {"PriceData" : []};
    function getPriceData(i) {
        if( i < result.length ) {
            mongoDbObj.priceSchema.find({$and:[{state_name:"ILLINOIS"},{commodity_desc: result[i]}]},{_id:0}).toArray( function(err, rslt){
                if( err ) {
                    console.log('error: '+err)
                }
                else {
                    if(rslt.length > 0){
                        for(var j = 0; j < rslt.length ; j++){
                            cropPriceData.PriceData.push(rslt[j]);
                        }
                    }
                    getPriceData(i+1)
                }
            });
        }
        if(i==result.length){
            console.log(cropPriceData);
            sendCropData(res, jsonArray, cropPriceData);
        }
    }
    getPriceData(0)
}

function sendCropData(res,jsonArray, cropPriceData) {
    var cropJSON = {"cropData": []};
    console.log(jsonArray)
    console.log(cropPriceData.PriceData)
    jsonArray.forEach(function (cropDetail) {
        cropPriceData.PriceData.forEach(function (priceData) {
            if (cropDetail.cropName == priceData.commodity_desc) {
                if (cropJSON.cropData.length > 0) {
                    var tempJSON = cropJSON.cropData;
                    var checkEntry = 0;
                    cropJSON.cropData.forEach(function (cropFinal) {
                        if (cropFinal.name == cropDetail.cropName) {
                            checkEntry = 1;
                            cropFinal.year.push(parseInt(priceData.year));
                            cropFinal.price.push(priceData.value);
                        }
                    });
                    if (checkEntry == 0) {
                        var tempData = {
                            "name": cropDetail.cropName.toString(),
                            "arc": cropDetail.cropAcres,
                            "unit": priceData.unit_desc,
                            "year": [parseInt(priceData.year)],
                            "price": [priceData.value]
                        };
                        cropJSON.cropData.push(tempData);
                    }
                }
                else {
                    var tempData = {
                        "name": cropDetail.cropName.toString(),
                        "arc": cropDetail.cropAcres,
                        "unit": priceData.unit_desc,
                        "year": [parseInt(priceData.year)],
                        "price": [priceData.value]
                    };
                    cropJSON.cropData.push(tempData);
                }
            }

        });
    });
    if (cropJSON.cropData.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(cropJSON.cropData));
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(cropJSON.cropData));
    }
}

exports.insertPriceData = function(jsonObj, res){
    var mongoDbObj = getMongoClient.mongoDbObj();
    jsonObj.forEach(function(childJsonObj){
        mongoDbObj.priceSchema.insert(childJsonObj,{w:1},function(err){
            if(err){
                res.write('Unable to write Data');
                res.end();
            }
            else{
                res.write('Data Success');
                res.end();
            }
        });
    });
};

exports.insertAreaData = function(jsonObj, res){
    var mongoDbObj = getMongoClient.mongoDbObj();
    console.log(jsonObj);
    jsonObj.forEach(function(childJsonObj){
        mongoDbObj.areaSchema.insert(childJsonObj,{w:1},function(err){
            if(err){
                res.write('Unable to write Data');
                res.end();
            }
            else{
                res.write('Data Success');
                res.end();
            }
        });
    });
};
