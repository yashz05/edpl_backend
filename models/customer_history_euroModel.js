const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const customer_history_euroSchema = new Schema({
	'title' : String,
	'active' : Boolean
},
{ timestamps: true });

module.exports = mongoose.model('customer_history_euro', customer_history_euroSchema);
