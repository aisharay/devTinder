console.log("Aisha, you can do it");


const express = require("express");
const connectDB = require("./config/database");
const app = express(); 
const User = require("./models/user");
const validateSignupData = require("./utils/validation");

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
  const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!isMatch) return res.status(401).send("Invalid credentials");
  res.send("Login successful");
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