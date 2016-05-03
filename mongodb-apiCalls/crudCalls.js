/**
 * Created by Bharath Kumar on 5/3/2016.
 */
var getMongoClient = require('../mongo-Config/connectMongo')

exports.areaSchemaSearch=function(req,res){
    var mongoDbObj = getMongoClient.mongoDbObj();
    var commodity_array=[];
    console.log("mongo connectivity"+mongoDbObj);
    mongoDbObj.areaSchema.distinct("commodity_desc" , { "county_name": "PENDLETON" } ,function(err,user){
        if(err){throw err;}
        else{
            if(user){
                for(i=0;i<user.length;i++)
                {
                    console.log("commodity data is here" + user[i]);
                   // comodity_array.push(user[i]);
                    mongoDbObj.areaSchema.find({$and: [{county_name: "PENDLETON"}, {commodity_desc: user[i]}]},{_id:0,value:1,commodity_desc:1}).toArray(function(err, user1){
                    if(err)throw err;
                        else{
                        if(user1){
                            for(j=0;j<user1.length;j++) {
                                console.log("value data of is here"+user1[j].commodity_desc+"" + user1[j].value);

                               commodity_array.push({"commodity_name":user1[j].commodity_desc,"commodity_value":Number(user1[j].value)});
                                for(k=0;k<commodity_array.length;k++){
                                    console.log("type of value is"+typeof(commodity_array[k].commodity_value));
                                    console.log("comodity_array is"+commodity_array[k].commodity_name+"value is"+commodity_array[k].commodity_value);
                                }
                            }

                        }
                        else{console.log("couldnt get data");}
                    }

                    })//closing second query
                }//closing for loop

            }//closing if
          else{
                console.log("Could not get the data");
            }
         
        }//closing else
    });//closing first query


};//closing main function


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
