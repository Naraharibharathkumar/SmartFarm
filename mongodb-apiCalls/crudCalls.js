/**
 * Created by Bharath Kumar on 5/3/2016.
 */
var getMongoClient = require('../mongo-Config/connectMongo')

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