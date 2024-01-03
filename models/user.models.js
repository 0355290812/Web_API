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
    image: {
        type: String,
        default: "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
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
