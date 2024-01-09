const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const BlackList = require('../models/blackList.models')
const User = require('../models/user.models')
const Instructor = require('../models/instructor.models')

const createJWT = (user) => {
    const token = jwt.sign({
        id: user.id, 
        userName: user.username,
        email: user.email
    }, process.env.JWT_SECRET)

    return token
}

const protect = async (req, res, next) => {
    const bearer = req.headers.authorization
    
    if (!bearer) {
        res.status(401).json({
            status: "fail",
            message: "Not authorized"
        })
        return
    }

    const [, token] = bearer.split(' ')
    if (!token) {
        res.status(401).json({
            status: "fail",
            message: "Not authorized"
        })
        return
    }

    const checkIfBlacklisted = await BlackList.findOne({token})
    if (checkIfBlacklisted) 
        return res.status(401).json({ 
            status: "fail",
            message: "This session has expired. Please login" 
        });

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
        return
    } catch (e) {
        console.log(e)
        res.status(401).json({
            status: "fail",
            message: "Not valid token"
        })
        return 
    }
}

const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash)
}

const hashPassword = (password) => {
    return bcrypt.hash(password, 5)
}

const verifyRole = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id })

    if (!user) {
        res.status(401).json({
            status: "fail",
            message: "Not Authorized"
        })
        return
    }
    if (user.role !== "instructor") {
        res.status(401).json({
            status: "fail",
            message: "Access denied"
        })
        return 
    } 

    next();
}

module.exports = { createJWT, protect, comparePassword, hashPassword, verifyRole }
