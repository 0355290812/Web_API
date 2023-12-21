const mongoose = require('mongoose')

const video = mongoose.Schema({
    url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('video', video)
