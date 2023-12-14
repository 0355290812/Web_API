const express = require('express')
const { getInfo, updateInfo } = require('../controllers/instructor.controllers')
const { getCourseByInstructor, getDetailCourseByInstructor } = require('../controllers/course.controllers')
const router = express.Router()

router.get('/course', getCourseByInstructor) 
router.get('/course/:id', getDetailCourseByInstructor)
router.post('/course', (req, res) => {})
router.put('/course/:id', (req, res) => {})
router.delete('/course/:id', (req, res) => {})

router.get('/info', getInfo)
router.put('/info', updateInfo)

module.exports = router
