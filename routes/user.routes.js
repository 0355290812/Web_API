const express = require('express')
const router = express.Router()
const { getStatusInstructor, getAllInstructor, getInstructorByID, createInstructor, updateFollowInstructor } = require('../controllers/instructor.controllers')
const { getAllCourse, getCourseById, buyCourse, checkRegistered } = require('../controllers/course.controllers')
const { getCoursesBookmarked, updateCourseBookmarked } = require('../controllers/bookmarked.controllers')
const { getCoursesWatching } = require('../controllers/user_course.controllers')

// router.get('/instructor', getAllInstructor)
// router.get('/instructor/:id', getInstructorByID)
router.post('/register-instructor', createInstructor)
router.get('/status-instructor', getStatusInstructor)

router.get('/course/bookmarked', getCoursesBookmarked)
router.put('/course/:id/bookmarked', updateCourseBookmarked)

router.get('/course/watching', getCoursesWatching)

router.get('/course', getAllCourse)
router.get('/course/:id', getCourseById)
router.post('/course/:id/registration', buyCourse)

router.put('/instructor/:id/follow', updateFollowInstructor)

module.exports = router
