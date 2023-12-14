const { Router } = require('express')
const { protect, verifyRole } = require('../utils/auth.utils')
const userRoute = require('./user.routes')
const instructorRoute = require('./instructor.routes')
const guestRoute = require('./guest.routes')
const router = Router()

router.use('/instructor', protect, verifyRole, instructorRoute)
router.use('/user', protect, userRoute)
router.use('/', guestRoute)

module.exports = router
