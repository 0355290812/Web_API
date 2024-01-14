const Bookmarked = require('../models/bookmarked.models')
const Course = require('../models/course.models')

const getCoursesBookmarked = async (req, res) => {
    try {
        const list_bookmarked = await Bookmarked.findOne({
            user: req.user.id
        })
        .populate({ path: 'list_bookmarked', populate: { path: 'instructor' } })
        res.status(200).json({
            status: "success",
            data: list_bookmarked.list_bookmarked,
            message: "All course bookmarked"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateCourseBookmarked = async (req, res) => {
    const list_bookmarked = await Bookmarked.findOne({
        user: req.user.id
    })

    const infoCourse = await Course.findOne({
        _id: req.params.id
    })
    if (infoCourse.instructor == req.user.id) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "You can't bookmark your own course"
        })
        return
    }

    let message = ''
    const course = req.params.id
    if (!list_bookmarked.list_bookmarked.includes(course)){
        list_bookmarked.list_bookmarked.push(course)
        message = 'Add more success'
    } else {
        list_bookmarked.list_bookmarked.splice(list_bookmarked.list_bookmarked.indexOf(course), 1)
        message = 'Remove success'
    }
    await list_bookmarked.save();
    
    res.status(200).json({
        status: "success",
        data: list_bookmarked,
        message: message
    })
}

module.exports = {  getCoursesBookmarked, updateCourseBookmarked }
