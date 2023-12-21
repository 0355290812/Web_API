const User_Course = require('../models/user_course.models')

const getCoursesWatching = async (req, res) => {
    const user_course = await User_Course.find({ user: req.user.id }, { select: 'course' })

    res.status(200).json({
        status: "success",
        data: user_course
    })
}

module.exports = { getCoursesWatching }
