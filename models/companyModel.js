const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const companySchema = new Schema({
	'name' : String,
	'address' : Array,
	'sid' : String,
	'area_of_company' : String,
	'person_to_contact' : Array,
	'customer_type' : String,
	'customer_grade' : String,
	'customer_history' : String,
	'customer_history_with_euro' : String,
	'mass_mailling' : Boolean,
	'diwali_gift' : Boolean,
	'ladoo_gift' : Boolean,
	'other_gift' : Boolean,
	'send_sample_catalogue' : Boolean,
	'sample_catalouge_type' : Array,
	'sample_catalouge_data' : Array,
	'first_visited' : Date,
	'next_visit' : Date
});

module.exports = mongoose.model('company', companySchema);
