const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const validateProfileEdit = require('../utils/validation');

profileRouter.get('/profile', userAuth, async (req, res) => {
    const user = req.user;
    res.send(user);
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    //validate my profile edit data
    try {
        if (!validateProfileEdit(req.body)) {
            return res.status(400).send("Invalid data");
        }

        Object.keys(req.body).forEach((key) => {
            req.user[key] = req.body[key];
        });

        await req.user.save();

        res.send("Profile updated successfully");
    } catch (error) {
        res.status(500).send("An error occurred while updating the profile");
    }
});

module.exports = profileRouter;