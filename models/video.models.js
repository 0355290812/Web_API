const mongoose = require('mongoose')

const video = mongoose.Schema({
    url: {
        type: String,
        required: true
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

module.exports = mongoose.model('video', video)
