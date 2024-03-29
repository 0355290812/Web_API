const mongoose = require('mongoose')

const review = mongoose.Schema({
    star: {
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
        type: {
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
        },
        required: false
    }
}, { timestamp: true })

module.exports = mongoose.model('review', review)
