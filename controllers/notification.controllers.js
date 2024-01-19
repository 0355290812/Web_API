const Notification = require('../models/notification.models')

const getNotification = async (req, res) => {
    try {
        const notification = await Notification.find({ user: req.user._id }).populate('user')
        res.status(200).json({ 
            status: "success",
            data: notification 
        })
    } catch (error) {
        res.status(200).json({ 
            status: "fail",
            message: "No notification"
        })
    }
}   

const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create({ 
            user: req.body.user, 
            content: req.body.content 
        })
        res.status(200).json({ 
            status: "success",
            data: notification 
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}

const readNotification = async (req, res) => {
    try {
        const notification = await Notification.find({user: req.user.id, isRead: false})
        notification.forEach(async (element) => {
            element.isRead = true
            await element.save()
        });
        res.status(200).json({ 
            status: "success",
            data: notification 
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
    
}
module.exports = { getNotification, createNotification, readNotification }