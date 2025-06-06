const express = require('express');

const connectionRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user'); 

connectionRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    const { recipientId } = req.body;

    // Validate recipientId
    if (!recipientId) return res.status(400).send('Recipient ID is required');

    // Find recipient user
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).send('User not found');

    // Send connection request logic here
    const connection = new Connection({ sender: user._id, recipient: recipientId , status: 'pending' });
    connection.save();

    res.send('Connection request sent');
});

connectionRouter.post('/request/send/interested/:userID', userAuth, async (req, res) => {
    const user = req.user;
    const { senderId } = req.body;

    // Validate senderId
    if (!senderId) return res.status(400).send('Sender ID is required');

    // Find sender user
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).send('User not found');

    // Accept connection request logic here
    const connection = await Connection.findOne({ sender: senderId, recipient: user._id });
    if (!connection) return res.status(404).send('Connection request not found');

    connection.status = 'accepted';
    connection.save();

    res.send('Connection request accepted');
}); 

connectionRouter.post('/request/send/ignored/:userID', userAuth, async (req, res) => {
    const user = req.user;
    const { senderId } = req.body;

    // Validate senderId
    if (!senderId) return res.status(400).send('Sender ID is required');

    // Find sender user
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).send('User not found');

    // Decline connection request logic here
    const connection = await Connection.findOne({ sender: senderId, recipient: user._id });
    if (!connection) return res.status(404).send('Connection request not found');

    connection.status = 'declined';
    connection.save();

    res.send('Connection request declined');
});

module.exports = connectionRouter;