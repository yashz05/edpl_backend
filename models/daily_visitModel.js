const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daily_visitSchema = new Schema(
  {
    company_name: String,
    customer_name: String,
    data: Object,
    spid: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("daily_visit", daily_visitSchema);
