const Instructor = require('../models/instructor.models')
const User = require('../models/user.models')
const review = require('../models/review.models')
const User_Instructor = require('../models/user_instructor.models')

const getAllInstructor = async (req, res) => {
    const page_size = req.query.page_size || 20
    const page = req.query.page || 1
    const search = req.query.search || ""
    const sort = (req.query.sort || "DSC") == "ASC" ? 1 : -1
    const value_sort = req.query.value_sort || "num_registration"
    const status = req.query.status
    const users = await User.find({
        role: "instructor",
        name: {
            $regex: search, $options: 'i'
        }
    }, {
        select: '_id'
    })
    try {
        if (status == "online" || status == "offline") {
            const instructor = await Instructor.find({
                active_status: status,
                user: {
                    $in: users
                }
            })
                .sort({ [value_sort]: sort })
                .skip((page - 1) * page_size)
                .limit(page_size)
                .populate('user')

            res.status(200).json({
                status: "success",
                data: instructor,
                message: 'Get all instructors'
            })
        } else {
            const instructor = await Instructor.find({
                user: {
                    $in: users
                }
            })
                .sort({ [value_sort]: sort })
                .skip((page - 1) * page_size)
                .limit(page_size)
                .populate('user')

            res.status(200).json({
                status: "success",
                data: instructor,
                message: 'Get all instructors'
            })
        }

    } catch (error) {
        console.log(error);
    }

}

const getInstructorByID = async (req, res) => {

    try {
        const instructor = await Instructor.findOne({ _id: req.params.id }).populate('user').populate({ path:'reviews', populate: {path: 'user'}})

        let isFollowed = false
        if (req.user) {
            const user_instructor = await User_Instructor.findOne({ user: req.user.id })
            if (user_instructor.instructors.includes(req.params.id)) {
                isFollowed = true
            } else {
                isFollowed = false
            }
        }
        res.status(200).json({
            status: "success",
            data: { 
                ...instructor._doc,
                isFollowed: isFollowed
            },
            message: "Get Success"
        })
    } catch (error) {
        console.log(error);
    }
}

const createInstructor = async (req, res) => {

    const instructor = await Instructor.findOneAndUpdate({
        user: req.user.id
    }, {
        subjects: req.body.subjects,
        certificates: req.body.certificates,
        academic_level: req.body.academic_level,
        user: req.user.id,
        image: req.body.image,
        status: "pending",
        active_status: "offline"
    }, { upsert: true, new: true })

    if (!instructor) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Create Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: instructor,
        message: "Awaiting approval"
    })
}

const getStatusInstructor = async (req, res) => {
    const instructor = await Instructor.findOne({
        user: req.user.id
    })

    if (!instructor) {
        res.status(200).json({
            status: "success",
            data: {
                status: "unregister"
            }
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: {
            status: instructor.status
        }
    })

}

const getInfo = async (req, res) => {
    const instructor = await Instructor.findOne({ user: req.user.id }).populate('user')
    res.status(200).json({
        status: "success",
        data: instructor,
        message: "Success"
    })
}
const updateInfo = async (req, res) => {
    const instructor = await Instructor.findOneAndUpdate({
        user: req.user.id
    }, {
        subjects: req.body.subjects,
        certificates: req.body.certificates,
        academic_level: req.body.academic_level,
        image: req.body.image,
        description: req.body.description,
        active_status: req.body.active_status,
        price: req.body.price
    }, { new: true }).populate('user')

    res.status(200).json({
        status: "Success",
        data: instructor,
        message: "Information has been changed"
    })
}

const updateFollowInstructor = async (req, res) => {

    const user_instructor = await User_Instructor.findOne({ user: req.user.id })
    const instructor = await Instructor.findOne({ _id: req.params.id })

    if (req.user.id == instructor.user) {
        res.status(500).json({
            status: "failed",
            message: "You can't follow yourself"
        })
        return
    }
    if (!user_instructor) {
        res.status(500).json({
            status: "failed",
            message: "User not found"
        })
        return
    }
    if (user_instructor.instructors.includes(req.params.id)) {
        user_instructor.instructors.splice(user_instructor.instructors.indexOf(req.params.id), 1)
        instructor.following -= 1
    } else {
        user_instructor.instructors.push(req.params.id)
        instructor.following += 1
    }

    await user_instructor.save()
    await instructor.save()

    res.status(200).json({
        status: "success",
        data: user_instructor,
        message: "Update success"
    })
}
module.exports = { getAllInstructor, getInstructorByID, createInstructor, getInfo, updateInfo, getStatusInstructor, updateFollowInstructor }
