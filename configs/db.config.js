const mongoose = require('mongoose')

const connect = async () => {
    try {
        return await mongoose.connect('mongodb+srv://ha2kv3:zUy9RGTmB8hWvqum@learningsupport.ueeu5bg.mongodb.net/LearningSupport');
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connect }
