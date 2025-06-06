const express = require('express');

const connectionRequestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user'); 
const ConnectionRequest = require('../models/connectionRequest');

connectionRequestRouter.post('/request/send/interested/:userID', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { senderId } = req.body;
        if (!senderId) return res.status(400).send('Sender ID is required');
        const sender = await User.findById(senderId);
        if (!sender) return res.status(404).send('User not found');
        const connectionRequest = await ConnectionRequest.findOne({ sender: senderId, recipient: user._id });
        if (!connectionRequest) return res.status(404).send('Connection request not found');
        connectionRequest.status = 'accepted';
        await connectionRequest.save();
        res.send('Connection request accepted');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

connectionRequestRouter.post('/request/send/ignored/:userID', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { senderId } = req.body;
        if (!senderId) return res.status(400).send('Sender ID is required');
        const sender = await User.findById(senderId);
        if (!sender) return res.status(404).send('User not found');
        const connectionRequest = await ConnectionRequest.findOne({ sender: senderId, recipient: user._id });
        if (!connectionRequest) return res.status(404).send('Connection request not found');
        connectionRequest.status = 'declined';
        await connectionRequest.save();
        res.send('Connection request declined');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

connectionRequestRouter.get('/request/received', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const receivedRequests = await ConnectionRequest.find({ recipient: user._id });
        res.send(receivedRequests);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

connectionRequestRouter.get('/request/sent', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const sentRequests = await ConnectionRequest.find({ sender: user._id });
        res.send(sentRequests);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = connectionRequestRouter;