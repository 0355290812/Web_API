const mongoose = require('mongoose');

const payment = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String, 
        enum: ['recharge', 'withdraw', 'pay'],
        requried: true
    }, 
    message: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('payment', payment)
