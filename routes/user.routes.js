const express = require('express')
const router = express.Router()
const multer = require('multer');
const moment = require('moment');
const { getStatusInstructor, getAllInstructor, getInstructorByID, createInstructor, updateFollowInstructor, getFollowingInstructor } = require('../controllers/instructor.controllers')
const { getAllCourse, getCourseById, buyCourse, checkRegistered } = require('../controllers/course.controllers')
const { getCoursesBookmarked, updateCourseBookmarked } = require('../controllers/bookmarked.controllers')
const { getCoursesWatching } = require('../controllers/user_course.controllers')
const { changePassword, getInfo, updateInfo } = require('../controllers/user.controllers');
const { transactionHistory, recharge, vnpayReturn } = require('../controllers/payment.controllers');
const { rentInstructor, getBusyTime } = require('../controllers/rent.controllers');
const { getNotification, createNotification, readNotification } = require('../controllers/notification.controllers');
const { createReviewCourse, createReviewInstructor } = require('../controllers/review.controllers');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.get('/course/bookmarked', getCoursesBookmarked)
router.put('/course/:id/bookmarked', updateCourseBookmarked)

router.get('/course/watching', getCoursesWatching)

router.get('/course', getAllCourse)
router.get('/course/:id', getCourseById)
router.post('/course/:id/registration', buyCourse)
router.post('/course/:id/review', createReviewCourse)

router.put('/instructor/:id/follow', updateFollowInstructor)
router.get('/instructor/following', getFollowingInstructor)
router.post('/instructor/:id/review', createReviewInstructor)

router.get('/instructor/:id', getInstructorByID)
router.get('/instructor', getAllInstructor)
router.post('/register-instructor', upload.fields([{ name: 'certificates', maxCount: 10 }, { name: 'academic_level', maxCount: 10 }]), createInstructor)
router.get('/status-instructor', getStatusInstructor)

router.put('/change-password', changePassword)

router.get('/info', getInfo)
router.put('/info', upload.fields([{ name: 'image', maxCount: 1 }]), updateInfo)

router.get('/transaction-history', transactionHistory)

router.get('/notification', getNotification)
router.post('/notification', createNotification)
router.put('/notification', readNotification)

router.post('/recharge', recharge )
router.get('/vnpay_return', vnpayReturn)

router.post('/instructor/:id/rent', rentInstructor)
router.get('/instructor/:id/busy-time', getBusyTime)

module.exports = router
