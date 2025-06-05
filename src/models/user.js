const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
});

// "this" refers to the user object, and "this" is not available in arrow functions
userSchema.methods.getJWT = async function () {

    return jwt.sign({ _id: this._id }, "Tinder@secret@key", { expiresIn: "3h" });
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    return await bcrypt.compare(passwordInputByUser, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
