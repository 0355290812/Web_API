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
    }
}, { timestamp: true })

module.exports = mongoose.model('review', review)
