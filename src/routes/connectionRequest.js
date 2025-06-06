const express = require('express');

const connectionRequestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user'); 
const ConnectionRequest = require('../models/connectionRequest');

connectionRequestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    const { recipientId } = req.body;

    // Validate recipientId
    if (!recipientId) return res.status(400).send('Recipient ID is required');

    // Find recipient user
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).send('User not found');

    // Send connection request logic here
    const connectionRequest = new ConnectionRequest({ sender: user._id, recipient: recipientId , status: 'pending' });
    connectionRequest.save();

    res.send('Connection request sent');
});

connectionRequestRouter.post('/request/send/interested/:userID', userAuth, async (req, res) => {
    const user = req.user;
    const { senderId } = req.body;

    // Validate senderId
    if (!senderId) return res.status(400).send('Sender ID is required');

    // Find sender user
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).send('User not found');

    // Accept connection request logic here
    const connectionRequest = await ConnectionRequest.findOne({ sender: senderId, recipient: user._id });
    if (!connectionRequest) return res.status(404).send('Connection request not found');

    connectionRequest.status = 'accepted';
    connectionRequest.save();

    res.send('Connection request accepted');
}); 

connectionRequestRouter.post('/request/send/ignored/:userID', userAuth, async (req, res) => {
    const user = req.user;
    const { senderId } = req.body;

    // Validate senderId
    if (!senderId) return res.status(400).send('Sender ID is required');

    // Find sender user
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).send('User not found');

    // Decline connection request logic here
    const connectionRequest = await ConnectionRequest.findOne({ sender: senderId, recipient: user._id });
    if (!connectionRequest) return res.status(404).send('Connection request not found');

    connectionRequest.status = 'declined';
    connectionRequest.save();

    res.send('Connection request declined');
});

module.exports = connectionRequestRouter;