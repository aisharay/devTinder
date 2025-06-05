export const authMiddleware = (req, res, next) => {
  console.log("Auth middleware");
  next();
};


const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;
  const token = cookies.token;
  //validate Token
  const decodedMessage = await jwt.verify(token, "Tinder@secreat@key");
  if (!decodedMessage) return res.status(401).send("Unauthorized");

  const user = await User.findById(decodedMessage._id);
  req.user = user;
  next();
};

module.exports = userAuth;