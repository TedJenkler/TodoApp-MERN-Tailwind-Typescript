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
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        required: true
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Column', columnsSchema);