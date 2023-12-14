const express = require('express')
const { getAllCourse, getCourseById } = require('../controllers/course.controllers')
const { getAllInstructor, getInstructorByID } = require('../controllers/instructor.controllers')
const router = express.Router()

router.get('/course', getAllCourse)
router.get('/course/:id', getCourseById)
router.get('/instructor', getAllInstructor)
router.get('/instructor/:id', getInstructorByID)

module.exports = router
