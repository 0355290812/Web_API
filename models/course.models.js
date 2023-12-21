const mongoose = require('mongoose')

const course = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    level: [{
        type: String,
        enum: ["Cơ bản", "Thông hiểu", "Vận dụng", "Vận dụng cao"]
    }],
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chapter'
    }],
    thumbnails: [{
        type: String,
        required: true
    }],
    cover_image: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    // published: {
    //     type: Boolean,
    //     default: false
    // },
    subject: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    avg_rating: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0,
    },
    number_of_registration: {
        type: Number,
        default: 0 
    },
    status: {
        type: String,
        enum: ["pending", "approve", "rejected"],
        default: "pending"
    }
}, {timestamps: true})

module.exports = mongoose.model('course', course)
