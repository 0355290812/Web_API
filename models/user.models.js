const mongoose = require('mongoose') 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)
