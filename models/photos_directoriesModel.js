const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const photos_directoriesSchema = new Schema({
	'name' : String,
	'parent_directory' : String
});

module.exports = mongoose.model('photos_directories', photos_directoriesSchema);
