const user_instructor = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructor'
    }]
})

module.exports = mongoose.model('user_instructor', user_instructor)