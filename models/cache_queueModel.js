const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const cache_queueSchema = new Schema({
	'key' : String,
	'value' : String
},{
	timestamps : true
});

module.exports = mongoose.model('cache_queue', cache_queueSchema);
