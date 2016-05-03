/**
 * Created by Bharath Kumar on 5/3/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AreaSchema = new Schema({
    commodity_desc : {type: String, required: true, trim: true },
    class_desc : { type: String, required: true},
    statisticcat_desc : String,
    unit_desc : String,
    agg_level_desc : String,
    state_name : String,
    county_ansi : String,
    county_code : String,
    country_name : String,
    year : String,
    load_time : String,
    value : String
}).index({
    "$**" : "text"
});

module.exports = mongoose.model('Area', AreaSchema);