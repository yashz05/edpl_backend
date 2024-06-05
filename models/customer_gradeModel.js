const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const customer_gradeSchema = new Schema({
	'title' : String,
	'active' : Boolean
},
{ timestamps: true });

module.exports = mongoose.model('customer_grade', customer_gradeSchema);
