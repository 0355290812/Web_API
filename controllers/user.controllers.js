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

    if (req.files) {
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
module.exports = { createNewUser, signin, logout, changePassword, getInfo, updateInfo }
