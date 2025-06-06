const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['ignored','interested', 'accepted', 'declined'],
        default: 'ignored'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ConnectionRequest = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
module.exports = ConnectionRequest;