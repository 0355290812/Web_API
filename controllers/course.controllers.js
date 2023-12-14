const Course = require('../models/course.models')
const User_Course = require('../models/user_course.models')

const getAllCourse = async (req, res) => {
    const page_size = req.query.page_size || 20 
    const page = req.query.page || 1
    const search = req.query.search || ""
    const sort = req.query.sort || "DSC" == "ASC" ? 1 : -1
    const value_sort = req.query.value-sort || "avg_rating"

    const courses = await Course.find({
        title: {
            $regex: new RegExp(search, "i")
        }
    })
    .sort({ [value_sort]: sort })
    .skip((page - 1) * page_size)
    .limit(page_size)

    res.status(200).json({
        status: "success",
        data: courses,
        message: 'Get all courses'
    })
}

const getCourseById = async (req, res) => {
    const course = await Course.findOne({id: req.params.id}).populate('lesson')
    
    if (!course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Course does not exist"
        })
        return
    }

    const user_course = await User_Course.findOne({user_id: req.user.id, course_id: course.id})
    const status_register = user_course.status || "Unregistered"
    res.status(200).json({
        status: "success",
        data: { course, status_register },
        message: `Get course ${course.title}`
    })
}

const getCourseByInstructor = async (req, res) => {
    const courses = await Course.find({ instructor: req.user.id })

    res.status(200).json({
        status: "success",
        data: courses,
        message: "Get All Success"
    })
}

const getDetailCourseByInstructor = async (req, res) => {
    const course = await Course.findOne({ instructor: req.user.id, id: req.body.id })

    res.status(200).json({
        status: "success",
        data: course,
        message: "Get Course Success"
    })
}

const createCourse = async (req, res) => {
    const course = Course.create({
        
    })
}

module.exports = { getAllCourse, getCourseById, getCourseByInstructor, getDetailCourseByInstructor }
