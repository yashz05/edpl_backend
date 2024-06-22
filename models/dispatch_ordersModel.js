const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const dispatch_ordersSchema = new Schema({
	company_name: String,
    item_type: String,
    item_name: String,
    item_qty: String,
    item_rate: String,
    v_width: { type: String, default: "0" },
    v_length: { type: String, default: "0" },
    spid: String,
},
{ timestamps: true });

module.exports = mongoose.model('dispatch_orders', dispatch_ordersSchema);
