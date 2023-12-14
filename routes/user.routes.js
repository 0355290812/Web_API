const express = require('express')
const router = express.Router()
const { getAllInstructor, getInstructorByID, createInstructor } = require('../controllers/instructor.controllers')
const { getAllCourse, getCourseById } = require('../controllers/course.controllers')
const { getCoursesBookmarked, addCourseBookmarked, deleteCourseBookmarked } = require('../controllers/bookmarked.controllers')
const { checkCourse } = require('../utils/checkcourse.utils')

router.get('/instructor', getAllInstructor)
router.get('/instructor/:id', getInstructorByID)
router.post('/register-instructor', createInstructor)

router.get('/course', getAllCourse)
router.get('/course/:id', getCourseById)
router.get('/course/:id/lesson/:idlesson', checkCourse, (req, res) => {})


router.get('/course/bookmarked', getCoursesBookmarked)
router.put('/course/bookmarked', addCourseBookmarked)
router.delete('/course/bookmarked', deleteCourseBookmarked)

module.exports = router
