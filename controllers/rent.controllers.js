const Rent = require('../models/rent.models')
const Instructor = require('../models/instructor.models')
const callVideo = require('../controllers/callVideo.controllers')
const User = require('../models/user.models')

const rentInstructor = async (req, res) => {
    const user = req.user.id
    const instructor = await Instructor.findOne({ _id: req.params.id })
    const time = req.body.time
    const timeStart = req.body.timeStart
    const subject = req.body.subject
    const description = req.body.description

    const rent = await Rent.findOneAndUpdate({
        user: user
    }, { 
        user: user,
        instructor: instructor.id,
        time: time,
        timeStart: timeStart,
        price: time * instructor.price,
        subject: subject,
        description: description,
        status: "waiting"
    }, { upsert: true, new: true })

    res.status(200).json({
        status: "success",
        data: rent
    })
}

const submitRent = async (req, res) => {

    await callVideo.setRestToken();
    const room = await callVideo.createRoom();
    const { roomId } = room;
    console.log("roomId", roomId);
    const instructor = await Instructor.findOne({ user: req.user.id })
    const userInstructor = await User.findOne({ _id: instructor.user })
    const rent = await Rent.findOneAndUpdate({
        instructor: instructor.id,
        _id: req.params.id
    }, {
        status: "approve",
        roomId: roomId
    }, { new: true })

    const user = await User.findOne({ _id: rent.user })
    user.balance -= rent.price
    userInstructor.balance += rent.price

    await user.save()
    await userInstructor.save()

    res.status(200).json({
        status: "success",
        data: rent
    })
}

const deleteRent = async (req, res) => {
    const rent = await Rent.findOneAndDelete({
        user: req.user.id,
        _id: req.params.id
    })

    res.status(200).json({
        status: "success",
        data: rent
    })
}

const getRents = async (req, res) => {
    const instructor = await Instructor.findOne({ user: req.user.id })
    const status = req.params.status
    const rents = await Rent.find({
        instructor: instructor.id,
        status: status == "approve" ? "approve" : "waiting"
    }).populate({path: "user"})

    res.status(200).json({
        status: "success",
        data: rents
    })
}

module.exports = { rentInstructor, submitRent, deleteRent, getRents }
