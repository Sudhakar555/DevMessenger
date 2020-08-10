const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        rrequired: true
    },
    avatar: {
        type: String,
    },
    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('User', UserSchema) // setting model schema to User variable