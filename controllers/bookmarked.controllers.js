const Bookmarked = require('../models/bookmarked.models')

const getCoursesBookmarked = async (req, res) => {
    try {
        const list_bookmarked = await Bookmarked.findOne({
            user: req.user.id
        })
        res.status(200).json({
            status: "success",
            data: list_bookmarked,
            message: "All course bookmarked"
        })
    } catch (error) {
        console.log(error)
    }
}

const addCourseBookmarked = async (req, res) => {
    const list_bookmarked = await Bookmarked.findOne({
        user: req.user.id
    })

    const course = req.params.id
    if (!list_bookmarked.list_bookmarked.includes(course)){
        list_bookmarked.list_bookmarked.push(course)
    }
    await list_bookmarked.save();
    
    res.status(200).json({
        status: "success",
        data: list_bookmarked,
        message: "Add more success"
    })
}

const deleteCourseBookmarked = async (req, res) => {
    const list_bookmarked = await Bookmarked.findOne({
        user: req.user.id
    })

    const course = req.params.id
    if (list_bookmarked.list_bookmarked.includes(course)){
        list_bookmarked.list_bookmarked.splice(list_bookmarked.list_bookmarked.indexOf(course), 1)
    }
    await list_bookmarked.save()

    res.status(200).json({
        status: "success",
        data: list_bookmarked,
        message: "Delete success"
    })
}

module.exports = {  getCoursesBookmarked, addCourseBookmarked, deleteCourseBookmarked }
