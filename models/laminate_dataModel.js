const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const laminate_dataSchema = new Schema(
  {
    SrNo: String,
    ItemType: String,
    ItemName: String,
    ItemShortName: String,
    ItemGroupName: String,
    ItemCatName: String,
    ThicknessName: String,
    BrandName: String,
    ItemHeadingNo: String,
  },
  { timestamps: true ,collection: 'laminate_data' }
);

module.exports = mongoose.model("laminate_data", laminate_dataSchema);
