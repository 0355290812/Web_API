const mongoose = require('mongoose')

const course = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    chapter: [
        {
            title: {
                type: String,
                required: true
            },
            lessons: [
                {
                    lesson : {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'lesson'
                    }
                }
            ]
        }
    ],
    thumbnail: {
        type: String,
        required: true
    },
    cover_image: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    // published: {
    //     type: Boolean,
    //     default: false
    // },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course_review'
    }],
    category: [String],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    avg_rating: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "approve", "rejected"],
        default: "pending"
    }
}, {timestamps: true})

module.exports = mongoose.model('course', course)
