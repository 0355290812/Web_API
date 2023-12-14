const { Router } = require('express')
const { signin, createNewUser, logout } = require('../controllers/user.controllers')

const router = Router()

router.post('/signin', signin)
router.post('/signup', createNewUser)
router.post('/logout', logout)

module.exports = router
