const mongoose = require('mongoose')

const quizz = mongoose.Schema({
    list_question: {
        type: [
            {
                question: {
                    type: String,
                    required: true
                },
                answer: {
                    type: [String],
                    required: true
                },
                correct_answer: {
                    type: String,
                    required: true
                }
            }
        ]
    }, 
    lessson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson'
    },
    belongto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructor'
    }
})

module.exports = mongoose.model('quizz', quizz)
