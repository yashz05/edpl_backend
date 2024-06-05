const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const photosSchema = new Schema({
	'parent_dir' : String,
	'sub_dir' : String,
	'file_name' : String,
	'name':String
},
{ timestamps: true });

module.exports = mongoose.model('photos', photosSchema);
