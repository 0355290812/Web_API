const User = require('../models/user.models')
const BlackList = require('../models/blackList.models')
const { createJWT, hashPassword, comparePassword } = require('../utils/auth.utils')
const Bookmarked = require('../models/bookmarked.models')
const User_Course = require('../models/user_course.models')
const User_Instructor = require('../models/user_instructor.models')
const jwt = require('jsonwebtoken')

const createNewUser = async (req, res) => {
    const hash = await hashPassword(req.body.password)

    const usernameExist = await User.findOne({ username: req.body.username })
    if (usernameExist) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Username already exist"
        })
        return
    }

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Email already exist"
        })
        return
    }

    const user = await User.create({
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email
    })

    const bookmarked = await Bookmarked.create({ user: user.id })
    const user_course = await User_Course.create({ user: user.id })
    const user_instructor = await User_Instructor.create({ user: user.id })

    const token = createJWT(user)
    res.status(200).json({
        status: "success",
        data: {
            token: token,
            username: user.username,
            role: user.role,
            user_id: user.id
        }
    })
}

const signin = async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })

    const isValid = await comparePassword(req.body.password, user.password)

    if (!isValid) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Invalid username or password"
        })
        return
    }

    const token = createJWT(user)
    res.status(201).json({
        status: "success",
        data: {
            token: token,
            username: user.username,
            role: user.role,
            user_id: user.id
        },
        message: "Login Success"
    })
}

const logout = async (req, res) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        res.status(401).json({
            status: "failed",
            data: [],
            message: "Unauthorized"
        })
        return
    }

    const [, token] = bearer.split(' ')
    const checkIfBlacklisted = await BlackList.findOne({ token })
    if (checkIfBlacklisted) {
        res.status(204).json({
            status: "failed",
            data: [],
            message: "Token has been blocked"
        })
    }

    const newBlacklist = await BlackList.create({ token })
    res.status(201).json({
        status: "success",
        data: [],
        message: 'You are logged on'
    })
}

const changePassword = async (req, res) => {
    const user = await User.findOne({ _id: req.user.id })

    const isValid = await comparePassword(req.body.old_password, user.password)
    if (!isValid) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Wrong password"
        })
        return
    }

    const hash = await hashPassword(req.body.new_password)

    user.password = hash
    await user.save()

    res.status(200).json({
        status: "success",
        data: [],
        message: "Change password successfully"
    })
}

const getInfo = async (req, res) => {
    const user = await User.findOne({ _id: req.user.id })

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get user failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: user,
        message: "Success"
    })
}

const updateInfo = async (req, res) => {

    const user = await User.findOne({ _id: req.user.id })

    if (req.files && req.files.image) {
        if (req.body.email != user.email) {
            const emailExist = await User.findOne({ email: req.body.email })
            if (emailExist) {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: "Email already exist"
                })
                return
            }
            user.image = req.files.image[0].path
            user.email = req.body.email
            user.name = req.body.name
            await user.save()
        } else {
            user.image = req.files.image[0].path
            user.name = req.body.name
            await user.save()
        }
    } else {
        if (req.body.email != user.email) {
            const emailExist = await User.findOne({ email: req.body.email })
            if (emailExist) {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: "Email already exist"
                })
                return
            }
            user.email = req.body.email
            user.name = req.body.name
            await user.save()
        } else {
            user.name = req.body.name
            await user.save()
        }
    }
    res.status(200).json({
        status: "success",
        data: user,
        message: "Update user successfully"
    })
}

const getAllUsers = async (req, res) => {
    const search = req.query.search == "undefined" ? "" : req.query.search
    const name = req.query.name == "undefined" ? "" : req.query.name
    const page = req.query.page || 1
    const page_size = req.query.page_size || 10
    let totalSize = 0;
    let users = []
    if (search !== "undefined") {
        users = await User.find({ role: { $ne: "admin" }, name: { $regex: new RegExp(name, "iu") }, username: { $regex: new RegExp(search, "iu") } }).select("-password")
            .skip((page - 1) * page_size)
            .limit(page_size)
            .sort({ createdAt: -1 })
        totalSize = await User.find({ role: { $ne: "admin" }, name: { $regex: new RegExp(name, "iu") }, username: { $regex: new RegExp(search, "iu") } }).select("-password").countDocuments()

    } else {
        users = await User.find({ role: { $ne: "admin" } }).select("-password")
            .skip((page - 1) * page_size)
            .limit(page_size)
            .sort({ createdAt: -1 })
        totalSize = await User.find({ role: { $ne: "admin" }, name: { $regex: new RegExp(name, "iu") }, username: { $regex: new RegExp(search, "iu") } }).select("-password").countDocuments()

    }

    res.status(200).json({
        status: "success",
        data: {
            users,
            totalSize
        },
        message: "Get all users successfully"
    })
}

const getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password")

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get user failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: user,
        message: "Success"
    })
}

const updateUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get user failed"
        })
        return
    }

    user.name = req.body.name
    // user.role = req.body.role
    await user.save()

    res.status(200).json({
        status: "success",
        data: user,
        message: "Update user successfully"
    })
}

const deleteUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Delete user failed"
        })
        return
    }

    if (user.role === "instructor") {
        const instructor = await Instructor.findOneAndDelete({ user: user.id })
        const courses = await Course.find({ instructor: user.id })
        courses.forEach(async (course) => {
            if (course.chapters) {
                course.chapters.forEach(async (chapter) => {
                    const subChapter = await Chapter.findOne({ _id: chapter })
                    if (subChapter.lessons) {
                        subChapter.lessons.forEach(async (lesson) => {
                            const subLesson = await Lesson.findOne({ _id: lesson })
                            if (lesson.lessonType === "video") {
                                const video = await Video.findOneAndDelete({ _id: subLesson.content })
                            } else {
                                const quiz = await Quiz.findOneAndDelete({ _id: subLesson.content })
                            }
                            await subLesson.remove()
                        })
                    }
                    await Chapter.deleteOne({ _id: chapter })
                })
            }
            await Course.deleteOne({ _id: course.id })
        })
    }
    await User.deleteOne({ _id: user.id })

    res.status(200).json({
        status: "success",
        data: user,
        message: "Delete user successfully"
    })
}

const createUserByAdmin = async (req, res) => {
    const hash = await hashPassword(req.body.password)

    const usernameExist = await User.findOne({ username: req.body.username })
    if (usernameExist) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Username already exist"
        })
        return
    }

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Email already exist"
        })
        return
    }

    const user = await User.create({
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        balance: req.body.balance,
        role: req.body.role
    })

    if (req.body.role === "student") {
        const bookmarked = await Bookmarked.create({ user: user.id })
        const user_course = await User_Course.create({ user: user.id })
        const user_instructor = await User_Instructor.create({ user: user.id })
    }
    res.status(200).json({
        status: "success",
        data: user
    })
}
module.exports = { createNewUser, signin, logout, changePassword, getInfo, updateInfo, getAllUsers, getUserById, updateUserById, deleteUserById, createUserByAdmin }
