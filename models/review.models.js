const mongoose = require('mongoose')

const review = mongoose.Schema({
    start: {
        type: Number,
        min: 0,
        max: 5
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    feedback: {
        content: {
            type: String,
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'instructor'
        },
        date: {
            type: Date
        }
    }
}, { timestamp: true })

module.exports = mongoose.model('review', review)
