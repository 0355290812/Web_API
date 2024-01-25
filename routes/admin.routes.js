const express = require('express')
const router = express.Router()
const { getAllUsers, getUserById, updateUserById, deleteUserById, createUserByAdmin } = require('../controllers/user.controllers')
const { getAllInstructorByAdmin, getInstructorByAdmin, updateInstructorByAdmin, deleteInstructorByAdmin } = require('../controllers/instructor.controllers')
const { getCoursesByAdmin, getCourseByAdmin, updateCourseByAdmin, deleteCourseByAdmin } = require('../controllers/course.controllers')

router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUserById)
router.delete('/users/:id', deleteUserById)
router.post('/users', createUserByAdmin)

router.get('/instructors', getAllInstructorByAdmin)
router.get('/instructors/:id', getInstructorByAdmin)
router.put('/instructors/:id', updateInstructorByAdmin)
router.delete('/instructors/:id', deleteInstructorByAdmin)

router.get('/courses', getCoursesByAdmin )
router.get('/courses/:id', getCourseByAdmin)
router.put('/courses/:id', updateCourseByAdmin)
router.delete('/courses/:id', deleteCourseByAdmin)

module.exports = router