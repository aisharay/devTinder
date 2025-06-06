const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //creates a reference to the User model
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

//pre save middleware, this will be checked before adding new entry to db
ConnectionRequestSchema.pre('save', function (next) {
    if (this.sender === this.recipient) {
        return next(new Error('You cannot send a connection request to yourself'));
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
module.exports = ConnectionRequest;