/**
 * Created by Bharath Kumar on 5/3/2016.
 */

var getMongoClient = require('../mongo-Config/connectMongo');

exports.getAreaData = function(res, countyName, callback){
    var mongoDbObj = getMongoClient.mongoDbObj();
    var result = getDistinctCrops(res, mongoDbObj, countyName, callback);
};

function getAverageArea(res, mongoDbObj, countyName, result, rslt){
    var k = 0;
    var jsonArray = [];
    var avg = 0;
    console.log(result);
    console.log(rslt);
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
        getCropPriceData(res, mongoDbObj, countyName, result, jsonArray)
    }
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

function sendCropData(res,jsonArray, cropPriceData){
    var cropJSON = {"cropData" : []};
    function parseCropData(i){
        if(i < jsonArray.length){
            JSON.stringify({"key" : "value"},function(err){
                if(err){
                    console.log('error: '+err)
                }
                else{
                    for(var j = 0; j < cropPriceData.PriceData.length; j++){
                        if(jsonArray[i].cropName == cropPriceData.PriceData[j].commodity_desc){
                            if(cropJSON.cropData.length > 0){
                                var tempJSON = cropJSON.cropData;
                                console.dir(JSON.parse(tempJSON[0].toString()));
                                if(cropJSON.cropData[i].name == jsonArray[i].cropName){
                                    cropJSON.cropData[i].year.push(parseInt(cropPriceData.PriceData[j].year));
                                    cropJSON.cropData[i].price.push(cropPriceData.PriceData[j].value);
                                }
                            }
                            else{
                                var tempData ={
                                    "name" : jsonArray[i].cropName.toString(),
                                    "arc" : jsonArray[i].cropAcres,
                                    "unit" : cropPriceData.PriceData[j].unit_desc,
                                    "year" : [parseInt(cropPriceData.PriceData[j].year)],
                                    "price" : [cropPriceData.PriceData[j].value]
                                };
                                cropJSON.cropData.push(tempData);
                            }
                        }
                    }
                }
                parseCropData(i+1);
            });
        }
        if(i==jsonArray.length){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(cropData));
        }
    }
    parseCropData(0)
}

function getCropAreaData(res,mongoDbObj, countyName,result, callback){
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
    console.log(jsonObj);
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
