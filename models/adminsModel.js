const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const adminsSchema = new Schema({
	'name' : String,
	'email' : String,
	'password' : String,
	'admin' : Boolean
});

module.exports = mongoose.model('admins', adminsSchema);
