// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// schema for the user model
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            //unique: true 
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// we have used natchPassword method to compare the password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", UserSchema);
module.exports = { userModel };