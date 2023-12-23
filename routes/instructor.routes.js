const express = require('express')
const multer = require('multer');

const { getInfo, updateInfo } = require('../controllers/instructor.controllers')
const { getCourseByInstructor, getDetailCourseByInstructor, createCourse, updateCourseByInstructor, deleteCourse } = require('../controllers/course.controllers')
const { createLesson, getLesson, deleteLesson, updateLesson } = require('../controllers/lesson.controllers')
const { createChapter, getChapter, deleteChapter, updateChapter } = require('../controllers/chapter.controllers')
const { getQuizz, createQuizz, updateQuizz, deleteQuizz } = require('../controllers/quizz.controllers')
const { getVideo, createVideo, updateVideo, deleteVideo } = require('../controllers/video.controllers')
const router = express.Router()

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.get('/course', getCourseByInstructor) 
router.get('/course/:id', getDetailCourseByInstructor)
router.post('/course', upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'thumbnails', maxCount: 10 }]) ,createCourse)
router.put('/course/:id', updateCourseByInstructor)
router.delete('/course/:id', deleteCourse)

router.get('/chapter/:id', getChapter)
router.post('/chapter', createChapter)
router.put('/chapter/:id', updateChapter)
router.delete('/chapter/:id', deleteChapter)

router.get('/lesson/:id', getLesson)
router.post('/lesson', createLesson)
router.put('/lesson/:id', updateLesson)
router.delete('/lesson/:id', deleteLesson)

router.get('/quizz/:id', getQuizz)
router.post('/quizz', createQuizz)
router.put('/quizz/:id', updateQuizz)
router.delete('/quizz/:id', deleteQuizz)

router.get('/video/:id', getVideo)
router.post('/video', createVideo)
router.put('/video/:id', updateVideo)
router.delete('/video/:id', deleteVideo)


router.get('/info', getInfo)
router.put('/info', updateInfo)

router.get('/', (req, res) => {res.send("Hello Instructor")})

module.exports = router
