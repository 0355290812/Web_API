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
    const listRent = await Rent.find({ instructor: instructor.id, status: "approve" })

    if (new Date(timeStart).getTime() < Date.now()) {
        res.status(400).json({
            status: "fail",
            message: "Cannot schedule in the past"
        })
        return
    }

    const checkTime = listRent.some((rent) => { 
        let dateOldRent = new Date(rent.timeStart)
        let dateNewRent = new Date(timeStart)
        if (dateOldRent.getTime() <= dateNewRent.getTime() && dateNewRent.getTime() <= dateOldRent.getTime() + rent.time * 60 * 60 * 1000) {
            return true
        }
        if (dateNewRent.getTime() <= dateOldRent.getTime() && dateOldRent.getTime() <= dateNewRent.getTime() + time * 60 * 60 * 1000) {
            return true
        }
        return false
    })
    if (checkTime) {
        res.status(400).json({
            status: "fail",
            message: "This time has already been booked"
        })
        return
    }
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
        roomId: "",
        status: "waiting"
    }, { upsert: true, new: true })

    res.status(200).json({
        status: "success",
        data: rent
    })
}

const getBusyTime = async (req, res) => {
    const listRent = await Rent.find({ instructor: req.params.id, status: "approve" })
    const busyTime = listRent.filter((rent) => {
        return new Date(rent.timeStart).getTime() >= Date.now()
    })
    const listTime = busyTime.map((rent) => {
        return {
            timeStart: rent.timeStart,
            timeEnd: new Date(new Date(rent.timeStart).getTime() + rent.time * 60 * 60 * 1000)
        }
    })

    console.log("busyTime", listTime);
    res.status(200).json({
        status: "success",
        data: listTime
    })
}
const submitRent = async (req, res) => {

    if (req.body.status != "approve") {
        const rent = await Rent.findOneAndUpdate({
            instructor: req.user.id,
            _id: req.params.id
        }, {
            status: "rejected"
        }, { new: true })

        res.status(200).json({
            status: "success",
            data: rent
        })
        return
    }

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
    const status = req.query.status
    const rents = await Rent.find({
        instructor: instructor.id,
        status: status == "approve" ? "approve" : "waiting",
        timeStart: { $gte: Date.now() }
    }).populate({path: "user"})

    res.status(200).json({
        status: "success",
        data: rents
    })
}

const getListRent = async (req, res) => {
    const user = await User.findOne({ _id: req.user.id })
    const status = req.query.status
    const rents = await Rent.find({
        user: user.id,
        status: status == "approve" ? "approve" : "waiting",
        timeStart: { $gte: Date.now() }
    }).populate({path: "instructor", populate: {path: "user"}})

    res.status(200).json({
        status: "success",
        data: rents
    })
}

const cancelRent = async (req, res) => {
    const rent = await Rent.findOneAndUpdate({
        user: req.user.id,
        _id: req.params.id
    }, {
        status: "rejected"
    }, { new: true })

    res.status(200).json({
        status: "success",
        data: rent
    })
}

module.exports = { rentInstructor, submitRent, deleteRent, getRents, getBusyTime, getListRent, cancelRent }
