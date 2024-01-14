const mongoose = require('mongoose')

const rent = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructor'
    },
    time: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
