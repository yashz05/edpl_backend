const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sales_teamSchema = new Schema(
  {
    name: String,
    email: String,
    active: Boolean,
    uuid: { type: String, unique: true }, 
    password: String,
    branch: String,
    access: {
      type: [String],
      default: ["sales"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sales_team", sales_teamSchema);
