console.log("Aisha, you can do it");


const express = require("express");
const connectDB = require("./config/database");
const app = express(); 
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookeParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connections } = require("mongoose");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const connectionRequestRouter = require("./routes/connectionRequest");

app.use(express.json());

app.use("/", authRouter)
app.use("/profile", profileRouter)
app.use("/", connectionRequestRouter)
app.use("/", userRouter)

app.use(cookeParser());



connectDB()
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("database connection failed");
    process.exit(1);
  });