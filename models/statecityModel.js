const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const statecitySchema = new Schema({
	'state' : String,
	'cities' : [String]
});

module.exports = mongoose.model('statecity', statecitySchema);
