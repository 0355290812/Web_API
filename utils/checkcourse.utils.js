const user_course = require('../models/user_course.models')

const checkCourse = (req, res, next) => {
    const user_id = req.user.id
    const course_id = req.params.id

    const user_course_status = user_course.findOne({ user_id, course_id })
    if (user_course_status.status == "cancelled" || !user_course_status) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "The science is impaired or unregistered"
        })
        return
    }

    next()
}

module.exports = { checkCourse }
