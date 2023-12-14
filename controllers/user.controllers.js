const User = require('../models/user.models')
const BlackList = require('../models/blackList.models')
const { createJWT, hashPassword, comparePassword } = require('../utils/auth.utils')
const jwt = require('jsonwebtoken')

const createNewUser = async (req, res) => {
    const hash = await hashPassword(req.body.password)

    const usernameExist = await User.findOne({username: req.body.username})
    if (usernameExist) {
        res.status(401).json({message: "Username already exist"})
        return
    }

    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) {
        res.status(401).json({message: "Email already exist"})
        return
    }

    const user = await User.create({
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email
    })

    if (user) {
        res.status(200).json({
            status: "success",
            data: {user},
            message: "Welcome to the Website!"
        })
    }
}

const signin = async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    
    const isValid = await comparePassword(req.body.password, user.password)

    if (!isValid) {
        res.status(401)
        res.send('Invalid username or password')
        return
    }

    const token = createJWT(user)
    res.status(200).json({
        status: "success",
        data: token,
        message: "Login Success"
    })
}

const logout = async(req, res) => {
    const bearer = req.headers.authorization
    if (!bearer) return res.sendStatus(201)
    const [,token] = bearer.split(' ')
    const checkIfBlacklisted = await BlackList.findOne({token})
    if (checkIfBlacklisted) return res.sendStatus(204)

    const newBlacklist = await BlackList.create({token})
    res.status(200).json({message: 'You are logged on'})
}


module.exports = { createNewUser, signin, logout }
