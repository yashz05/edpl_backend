const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sales_ordersSchema = new Schema(
  {
    company_name: String,
    item_type: String,
    item_name: String,
    item_qty: String,
    item_rate: String,
    v_width: { type: String, default: "0" },
    v_length: { type: String, default: "0" },
    spid: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("sales_orders", sales_ordersSchema);
