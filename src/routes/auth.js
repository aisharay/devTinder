const express = require('express');

const authRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const validateSignupData = require('../utils/validation');
const validateLoginData = require('../utils/validation');

authRouter.post('/signup', async (req, res) => {
    try {
        const { errors, valid } = validateSignupData(req.body);
        if (!valid) return res.status(400).json({ errors });
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const { name, email, Age } = req.body;
        const newUser = new User({ name, email, passwordHash, Age });
        await newUser.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(500).send("Error creating user");
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { errors, valid } = validateLoginData(req.body);
        if (!valid) return res.status(400).json({ errors });
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("User not found");
        const isPasswordValid = await user.validatePassword(req.body.password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { httpOnly: true });
            res.send("Login successful");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err) {
        res.status(500).send("Error logging in");
    }
});

authRouter.post('/logout', async (req, res) => {
    try {
        res.clearCookie("token");
        res.send("Logout successful");
    } catch (err) {
        res.status(500).send("Error logging out");
    }
});

module.exports = authRouter;