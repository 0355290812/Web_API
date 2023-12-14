const mongoose = require('mongoose')

const user_course = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    status: {
        type: String,
        enum: ["paid", "cancelled"]
    }
}, { timestamp: true })

module.exports = mongoose.model('user_course', user_course)
