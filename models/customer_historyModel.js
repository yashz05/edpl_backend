const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const customer_historySchema = new Schema({
	'title' : String,
	'active' : Boolean
},
{ timestamps: true });

module.exports = mongoose.model('customer_history', customer_historySchema);
