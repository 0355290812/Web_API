const mongoose = require('mongoose')

const course_review = mongoose.Schema({
    start: {
        type: Number,
        min: 0,
        max: 5
    },
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }
}, { timestamp: true })

module.exports = mongoose.model('course_review', course_review)
