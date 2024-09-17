const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const daily_collectionSchema = new Schema({
	'customer_name' : String,
	'amount' : String,
	'spid' : String,
	'remark': String
},{
	timestamps : true
});

module.exports = mongoose.model('daily_collection', daily_collectionSchema);
