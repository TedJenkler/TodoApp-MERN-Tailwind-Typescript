const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true
    },
    subtodos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtodo',
        required: true
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Todo', todoSchema);