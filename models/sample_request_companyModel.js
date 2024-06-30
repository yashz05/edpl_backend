const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sample_request_companySchema = new Schema(
  {
    company_name: String,
    type: String,
    data: Object,
    sentsample: { type: Boolean, default: false },
    spid: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "sample_request_company",
  sample_request_companySchema
);

