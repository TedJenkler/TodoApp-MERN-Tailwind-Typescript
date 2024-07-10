const mongoose = require('mongoose');

const subtodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subtodo', subtodoSchema);