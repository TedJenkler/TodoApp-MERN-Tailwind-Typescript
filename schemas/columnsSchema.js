const mongoose = require('mongoose');

const columnsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    tasks: [{
        type: String
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Column', columnsSchema);