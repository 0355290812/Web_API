const mongoose = require('mongoose')

const quizz = mongoose.Schema({
    list_question: {
        type: [
            {
                question: {
                    type: String,
                    required: true
                },
                answers: [{
                    text: {
                        type: String,
                        required: true
                    },
                    isCorrect: {
                        type: Boolean,
                        required: true
                    }
                }]
            }
        ]
    }
})

module.exports = mongoose.model('quizz', quizz)
