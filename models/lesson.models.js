const mongoose = require('mongoose')

const lesson = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    lessonType: {
        type: String,
        enum: ["quizz", "video"]
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'lessonType'
    }
})

module.exports = mongoose.model('lesson', lesson)
