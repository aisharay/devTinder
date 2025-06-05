console.log("Aisha, you can do it");


const express = require("express");
const connectDB = require("./config/database");
const app = express(); 
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookeParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth , async (req, res) => {
  const user = req.user;
  res.send(user);
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  const { recipientId } = req.body;

  // Validate recipientId
  if (!recipientId) return res.status(400).send("Recipient ID is required");

  // Find recipient user
  const recipient = await User.findById(recipientId);
  if (!recipient) return res.status(404).send("User not found");

  // Send connection request logic here
  const connection = new Connection({ sender: user._id, recipient: recipientId , status: "pending" });
  connection.save();

  res.send("Connection request sent");
});

app.post("/acceptConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  const { senderId } = req.body;

  // Validate senderId
  if (!senderId) return res.status(400).send("Sender ID is required");

  // Find sender user
  const sender = await User.findById(senderId);
  if (!sender) return res.status(404).send("User not found");

  // Accept connection request logic here
  const connection = await Connection.findOne({ sender: senderId, recipient: user._id });
  if (!connection) return res.status(404).send("Connection request not found");

  connection.status = "accepted";
  connection.save();

  res.send("Connection request accepted");
});

app.post("/declineConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  const { senderId } = req.body;

  // Validate senderId
  if (!senderId) return res.status(400).send("Sender ID is required");

  // Find sender user
  const sender = await User.findById(senderId);
  if (!sender) return res.status(404).send("User not found");

  // Decline connection request logic here
  const connection = await Connection.findOne({ sender: senderId, recipient: user._id });
  if (!connection) return res.status(404).send("Connection request not found");

  connection.status = "declined";
  connection.save();

  res.send("Connection request declined");
});

connectDB()
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("database connection failed");
    process.exit(1);});