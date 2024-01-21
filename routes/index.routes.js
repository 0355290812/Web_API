const { Router } = require('express')
const { protect, verifyRole, verifyAdmin } = require('../utils/auth.utils')
const userRoute = require('./user.routes')
const instructorRoute = require('./instructor.routes')
const guestRoute = require('./guest.routes')
const adminRoute = require('./admin.routes')
const router = Router()

router.use('/instructor', protect, verifyRole, instructorRoute)
router.use('/user', protect, userRoute)
router.use('/admin', protect, verifyAdmin, adminRoute)
router.use('/', guestRoute)

module.exports = router
