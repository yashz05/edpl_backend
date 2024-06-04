const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const dispatch_ordersSchema = new Schema({
	'comp_id' : String,
	'customer_name' : String,
	'item' : String,
	'quantity' : Number,
	'spid' : String
});

module.exports = mongoose.model('dispatch_orders', dispatch_ordersSchema);
