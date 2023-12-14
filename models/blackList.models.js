const mongoose = require('mongoose')
const blackList = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "user"
        }
    }, 
    { timestamps: true}
)

module.exports = mongoose.model('blacklist', blackList)
