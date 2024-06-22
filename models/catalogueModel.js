const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catalogueSchema = new Schema({
    SrNo: { type: String, default: '0' },
    ItemName: { type: String, unique: true }, // Ensure ItemName is unique
    Category: { type: String, default: 'null' }
}, {
    timestamps: true
});

module.exports = mongoose.model('catalogue', catalogueSchema);
