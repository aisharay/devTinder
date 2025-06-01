console.log("Aisha, you can do it");


const express = require("express");
const app = express();  

// app.use((req,res) => {
//   res.send("Hello World");
// });

app.use("/get", (req,res) => {
  res.send("got it");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});