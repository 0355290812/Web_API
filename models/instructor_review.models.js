const mongoose = require('mongoose')

const instructor_review = mongoose.Schema({
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
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructor'
    }
}, { timestamp: true })

module.exports = mongoose.model('instructor_review', instructor_review)
