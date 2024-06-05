const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const approval_menuSchema = new Schema({
	'client_name' : String,
	'project_name' : String,
	'item_design' : String,
	'tentative_qty' : Number,
	'from' : Date,
	'to' : Date,
	'rates' : String,
	'approved_by' : String,
	'contractor' : String
},
{ timestamps: true });

module.exports = mongoose.model('approval_menu ', approval_menuSchema);
