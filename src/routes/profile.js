const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const validateProfileEdit = require('../utils/validation');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("An error occurred while fetching the profile");
    }
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

profileRouter.patch("/password/reset", userAuth, async (req, res) => {
    try{
        const newPassword = req.body.password
        validatePassword(newPassword)

        const passwordHash = await bcrypt.hash(newPassword, saltValue)

        const user = req.user
        user["password"] = passwordHash
        await user.save()
        res.send("Password updated successfully")
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = profileRouter;