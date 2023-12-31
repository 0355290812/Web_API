const mongoose = require('mongoose')

const chapter = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson'
    }]
})

module.exports = mongoose.model('chapter', chapter)
