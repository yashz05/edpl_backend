const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const veneer_dataSchema = new Schema({
    SrNo: String,
    ItemName: { type: String, unique: true }, // Ensure ItemName is unique
    Category: String
}, {
    timestamps: true
});

module.exports = mongoose.model('veneer_data', veneer_dataSchema);
