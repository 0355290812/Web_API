const User_Course = require('../models/user_course.models')

const getCoursesWatching = async (req, res) => {
    const user_course = await User_Course.findOne({ user: req.user.id })
                                .populate({ path: 'courses', populate: { path: 'instructor' } })

    if (!user_course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get user course failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: user_course.courses
    })
}

module.exports = { getCoursesWatching }
