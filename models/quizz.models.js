const mongoose = require('mongoose')

const quizz = mongoose.Schema({
    list_question: {
        type: [
            {
                question: {
                    type: String,
                    required: true
                },
                answers: {
                    type: [String],
                    required: true
                },
                correct_answer: {
                    type: String,
                    required: true
                }
            }
        ]
    }
})

module.exports = mongoose.model('quizz', quizz)
