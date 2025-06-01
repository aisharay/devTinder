console.log("Aisha, you can do it");


const express = require("express");
const app = express(); 
const { authMiddleware } = require("./middlewares/auth"); 

app.get("/user", (req, res) => {
  res.send("Aisha");
});

app.post("/user", (req, res) => {
  res.send("User saved");
});

app.use("/test", (req,res) => {
  res.send("test result");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});