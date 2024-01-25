const Course = require('../models/course.models')
const User_Course = require('../models/user_course.models')
const User = require('../models/user.models')
const Bookmarked = require('../models/bookmarked.models')
const Video = require('../models/video.models')
const Quizz = require('../models/quizz.models')
const Chapter = require('../models/chapter.models')
const Lesson = require('../models/lesson.models')
const Instructor = require('../models/instructor.models')


const getAllCourse = async (req, res) => {
    const page_size = req.query.page_size || 20
    const page = req.query.page || 1
    const search = req.query.search || ""
    const sort = req.query.sort || "DSC" == "ASC" ? 1 : -1
    const value_sort = req.query.value_sort || "num_registration"

    const courses = await Course.find({
        $or: [
            {
                title: {
                    $regex: new RegExp(search, "iu")
                }
            },
            {
                subject: {
                    $regex: new RegExp(search, "iu")
                }
            }
        ],
        status: "approve"
    })
        .sort({ [value_sort]: sort })
        .skip((page - 1) * page_size)
        .limit(page_size)
        .populate({ path: 'instructor' })

    if (!courses) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get all courses failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: courses,
        message: 'Get all courses'
    })
}

const getCourseById = async (req, res) => {
    const course = await Course.findOne({ _id: req.params.id })
        .populate({ path: 'chapters', populate: { path: 'lessons', populate: { path: 'content' } } })
        .populate({ path: 'instructor' })
        .populate({ path: 'reviews', populate: { path: 'user' } })

    if (!course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Course does not exist"
        })
        return
    }
    let isBookmarked = false
    let isRegistered = false
    let hasReview = true
    try {
        if (req.user) {
            const user_course = await User_Course.findOne({ user: req.user.id })
            if (!user_course) {
                res.status(500).json({
                    status: "failed",
                    message: ""
                })
            }
            if (user_course.courses && user_course.courses.includes(req.params.id)) {
                isRegistered = true
                hasReview = course.reviews.some(review => review.user._id.toString() === req.user.id.toString())
            } else {
                isRegistered = false
            }

            const bookmarked = await Bookmarked.findOne({ user: req.user.id })
            if (!bookmarked) {
                res.status(500).json({
                    status: "failed",
                    message: ""
                })
            }
            if (bookmarked.list_bookmarked && bookmarked.list_bookmarked.includes(req.params.id)) {
                isBookmarked = true
            } else {
                isBookmarked = false
            }
        } else {
            isRegistered = false
            isBookmarked = false
            hasReview = true
        }


        res.status(200).json({
            status: "success",
            data: {
                ...course._doc,
                isBookmarked,
                isRegistered,
                hasReview
            },
            message: `Get course ${course.title}`
        })
    } catch (error) {
        console.log(error);
    }

}

const getCourseByInstructor = async (req, res) => {
    const sort = -1;
    const courses = await Course.find({ instructor: req.user.id }).sort({ createdAt: sort }).populate({ path: 'instructor' });

    res.status(200).json({
        status: "success",
        data: courses,
        message: "Get All Success"
    });
}

const getDetailCourseByInstructor = async (req, res) => {
    const course = await Course.findOne({ instructor: req.user.id, _id: req.params.id }).populate({ path: 'chapters', populate: { path: 'lessons', populate: { path: 'content' } } }).populate('instructor')

    res.status(200).json({
        status: "success",
        data: course,
        message: "Get Course Success"
    })
}

const createCourse = async (req, res) => {

    try {
        console.log(req.body.title, req.body.description, req.body.subject, req.body.level, parseInt(req.body.price), req.user.id)
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            thumbnails: req.files.thumbnails.map(file => file.path),
            cover_image: req.files.cover_image[0].path,
            instructor: req.user.id,
            subject: req.body.subject,
            level: req.body.level,
            price: parseInt(req.body.price)
        })

        console.log(course);

        if (!course) {
            res.status(500).json({
                status: "failed",
                data: [],
                message: "Create Failed"
            })
            return
        }

        res.status(200).json({
            status: "success",
            data: course,
            message: "Create course successfully"
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            data: [],
            message: error.message
        })
    }
}

const updateCourseByInstructor = async (req, res) => {
    const course = await Course.findOneAndUpdate({
        _id: req.params.id,
        instructor: req.user.id
    }, {
        title: req.body.title,
        description: req.body.description,
        level: req.body.level,
        chapters: req.body.chapters,
        thumbnails: req.body.thumbnails,
        cover_image: req.body.cover_image,
        subject: req.body.subject,
        price: req.body.price
    }, { new: true })

    if (!course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Update Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: course,
        message: "Update course successfully"
    })
}

const buyCourse = async (req, res) => {
    const course = await Course.findOne({ _id: req.params.id })

    const user = await User.findOne({ _id: req.user.id })
    const instructor = await User.findOne({ _id: course.instructor })
    if (course.instructor == user.id) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "You can't buy your own course"
        })
        return
    }

    if (course.price > user.balance) {
        res.status(402).json({
            status: "fail",
            message: "Account has insufficient funds"
        })
        return
    }

    const user_course = await User_Course.findOne({
        user: req.user.id
    })

    if (!user_course.courses.includes(req.params.id)) {
        user.balance -= course.price
        course.num_registration += 1
        instructor.balance += course.price
        user_course.courses.push(req.params.id)

        await user_course.save()
        await user.save()
        await course.save()
        await instructor.save()

        res.status(200).json({
            status: "success",
            data: user_course
        })
    } else {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "You have already registered for this course"
        })
    }
}

const checkRegistered = async (req, res) => {
    const checkRegistered = await User_Course.findOne({ user: req.user.id, course: req.params.id })
    const registered = checkRegistered ? "registered" : "unregistered"

    res.status(200).json({
        status: "success",
        data: registered
    })
}

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id })

        if (!course) {
            res.status(404).json({
                status: "fail",
                data: course,
                message: "Course not found"
            })
            return
        }

        if (course.num_registration != 0) {
            res.status(500).json({
                status: "fail",
                data: course,
                message: "Khoá học đã có người đăng ký không thể xóa"
            })
            return
        }
        res.status(200).json({
            status: "success",
            data: course,
            message: "Delete Success"
        })
    } catch (error) {
        console.log(error);
    }

}

const getCoursesByAdmin = async (req, res) => {
    const page_size = req.query.page_size || 20
    const page = req.query.page || 1
    let search = ""

    if (req.query.search) {
        search = JSON.parse(req.query.search)
    }

    if (req.query.status) {
        const courses = await Course.find({
            status: JSON.parse(req.query.status),
            title: {
                $regex: new RegExp(search, "iu")
            }
        })
            .populate('instructor')
            .sort({ createdAt: -1 })
            .skip((page - 1) * page_size)
            .limit(page_size)
        const totalSize = await Course.find(
            {
                status: JSON.parse(req.query.status),
                title: {
                    $regex: new RegExp(search, "iu")
                }
            }).countDocuments()
        res.status(200).json({
            status: "success",
            data: { courses, totalSize },
            message: 'Get all courses'
        })
    } else {
        const courses = await Course.find({
            title: {
                $regex: new RegExp(search, "iu")
            }
        })
            .populate('instructor')
            .sort({ createdAt: -1 })
            .skip((page - 1) * page_size)
            .limit(page_size)
        const totalSize = await Course.find(
            {
                title: {
                    $regex: new RegExp(search, "iu")
                }
            }).countDocuments()
        res.status(200).json({
            status: "success",
            data: { courses, totalSize },
            message: 'Get all courses'
        })
    }
}

const getCourseByAdmin = async (req, res) => {
    const course = await Course.findOne({ _id: req.params.id }).populate('instructor')

    if (!course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Course does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: course,
        message: `Get course ${course.title}`
    })
}

const updateCourseByAdmin = async (req, res) => {
    const course = await Course.findOneAndUpdate({
        _id: req.params.id
    }, {
        title: req.body.title,
        status: req.body.status
    }, { new: true })

    if (!course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Update Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: course,
        message: "Update course successfully"
    })
}

const deleteCourseByAdmin = async (req, res) => {
    const course = await Course.findOne({ _id: req.params.id })
    const instructor = await Instructor.findOne({ user: course.instructor })

    if (!course) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Course does not exist"
        })
        return
    }

    if (course.chapters) {
        course.chapters.forEach(async (chapter) => {
            const subChapter = await Chapter.findOne({ _id: chapter })
            if (subChapter.lessons) {
                subChapter.lessons.forEach(async (lesson) => {
                    const subLesson = await Lesson.findOne({ _id: lesson })
                    if (lesson.lessonType === "video") {
                        const video = await Video.findOneAndDelete({ _id: subLesson.content })
                    } else {
                        const quiz = await Quizz.findOneAndDelete({ _id: subLesson.content })
                    }
                    await subLesson.remove()
                })
            }
            await Chapter.deleteOne({ _id: chapter })
        })
    }
    await Course.deleteOne({ _id: course.id })
    instructor.num_course -= 1
    await instructor.save()
    res.status(200).json({
        status: "success",
        data: course,
        message: "Delete Success"
    })
}
module.exports = {
    getAllCourse,
    getCourseById,
    getCourseByInstructor,
    getDetailCourseByInstructor,
    createCourse,
    updateCourseByInstructor,
    buyCourse,
    checkRegistered,
    deleteCourse,
    getCourseByAdmin,
    getCoursesByAdmin,
    updateCourseByAdmin,
    deleteCourseByAdmin,
}
