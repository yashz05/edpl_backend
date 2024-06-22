const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const laminate_dataSchema = new Schema(
  {
    SrNo: String,
    ItemName: { type: String, unique: true }, // Ensure ItemName is unique
    Category: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("laminate_data", laminate_dataSchema);
