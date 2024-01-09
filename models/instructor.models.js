const mongoose = require('mongoose')

const instructor = mongoose.Schema({
    description: {
        type: String
    },
    subjects: [{
        type: String,
        required: true
    }],
    certificates: [{
        name: {
            type: String,
            required: true
        },
        image: {
            type: String
        }
    }],
    academic_level: [{
        name: {
            type: String,
            required: true
        },
        image: {
            type: String
        }
    }],
    follower: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    avg_rating: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    num_registration: {
        type: Number,
        default: 0
    },
    num_course: {
        type: Number,
        default: 0
    },
    user: {
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
}, { timestamps: true })

module.exports = mongoose.model('instructor', instructor)
