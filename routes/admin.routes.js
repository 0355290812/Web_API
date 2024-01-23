const express = require('express')
const router = express.Router()
const { getAllUsers, getUserById, updateUserById, deleteUserById, createUserByAdmin } = require('../controllers/user.controllers')
const { getAllInstructorByAdmin } = require('../controllers/instructor.controllers')

router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUserById)
router.delete('/users/:id', deleteUserById)
router.post('/users', createUserByAdmin)

router.get('/instructors', getAllInstructorByAdmin)

module.exports = router