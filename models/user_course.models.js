const mongoose = require('mongoose')

const user_course = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
        default: []
    }]
}, { timestamp: true })

module.exports = mongoose.model('user_course', user_course)
