/**
 * Created by Tiya on 29-04-2016.
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/smartfarm";

exports.checkDBConnection = function(req,res){


    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('smartfarm');
        //database connection testing with static values
        coll.find({CropName: "Barley"}).toArray(function(err, user) {

        if(err){
            throw err;
        }
        else{
            if(user )
            {
                var price=user[0].Price_2015;
                console.log("database connection is working fine"+price);
                res.render('/');
            }
            else{

                console.log("could not get data");
                res.render('/');
            }

        }
        });
    });

};