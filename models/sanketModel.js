const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const sanketSchema = new Schema({
	'name' : String,
	'age' : Number
});

module.exports = mongoose.model('sanket', sanketSchema);
