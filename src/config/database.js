const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://aisharay1842:Aisha123@cluster0.zea2y7u.mongodb.net/"
        );
};
module.exports = connectDB;