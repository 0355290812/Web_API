const mongoose = require('mongoose')

const bookmarked = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    list_bookmarked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})

module.exports = mongoose.model('bookmarked', bookmarked)
