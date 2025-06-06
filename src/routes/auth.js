const express = require('express');

const authRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const validateSignupData = require('../utils/validation');
const validateLoginData = require('../utils/validation');

authRouter.post('/signup', async (req, res) => {
    //validate the request
    const { errors, valid } = validateSignupData(req.body);
    if (!valid) return res.status(400).json({ errors });
    //encrypt the password
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    //create a new user
    const { name, email, Age } = req.body;
    const newUser = new User({ name, email, passwordHash, Age });
    newUser.save()
        .then(() => res.send("User created successfully"))
        .catch((err) => res.status(500).send("Error creating user"));
});

authRouter.post('/login', async (req, res) => {
    //validate the request
    const { errors, valid } = validateLoginData(req.body);
    if (!valid) return res.status(400).json({ errors });
    //check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");
    //check if password is correct
    const isPasswordValid = await user.validatePassword(req.body.password);
    if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token, { httpOnly: true });
        return res.send("Login successful");
    } else {
        return res.status(401).send("Invalid credentials");
    }
});

authRouter.post('/logout', async (req, res) => {
    res.clearCookie("token");
    res.send("Logout successful");
});

module.exports = authRouter;