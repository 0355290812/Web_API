const mongoose = require('mongoose')

const rent = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    time: {
        type: Number,
        required: true
    },
    roomId: {
        type: String
    },
    status: {
        type: String,
        enum: ["waiting", "approve", "rejected"],
        required: true,
        default: "waiting"
    }
}, { timestamps: true })

module.exports = mongoose.model('rent', rent)
