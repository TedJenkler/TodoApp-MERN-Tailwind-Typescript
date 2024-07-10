const { Timestamp } = require('bson');
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    columns: [],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Board', boardSchema);