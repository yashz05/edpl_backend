const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const sales_team = require("./sales_teamModel")

const companySchema = new Schema({
	'name' : String,
	'address' : Object,
	'sid': { type: String, ref: 'sales_team' }, // Keep this as a string
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
},
{ timestamps: true });


// to upper case befor displayin/storing the strng data
companySchema.pre('save', function(next) {

    for (let key in this.toObject()) {
        if (typeof this[key] === 'string') {
            this[key] = this[key].toUpperCase();
        }
    }
    next();
});

module.exports = mongoose.model('company', companySchema);
