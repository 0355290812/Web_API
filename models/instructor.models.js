const mongoose = require('mongoose')

const instructor = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    certificates: {
        type: [String],
        required: true
    },
    academic_level: {
        type: [String],
        required: true
    },
    follower: {
        type: Number,
        default: 0
    },
    review: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'review'
    },
    avg_rating: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ["pending", "approve", "rejected"],
        default: "pending"
    },
    active_status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline"
    }
})

module.exports = mongoose.model('instructor', instructor)
