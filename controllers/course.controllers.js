const Course = require('../models/course.models')
const User_Course = require('../models/user_course.models')
const User = require('../models/user.models')
const Bookmarked = require('../models/bookmarked.models')

const getAllCourse = async (req, res) => {
    const page_size = req.query.page_size || 20
    const page = req.query.page || 1
    const search = req.query.search || ""
    const sort = req.query.sort || "DSC" == "ASC" ? 1 : -1
    const value_sort = req.query.value_sort || "num_registration"

    const courses = await Course.find({
        title: {
            $regex: new RegExp(search, "i")
        },
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
    const course = await Course.findOne({ _id: req.params.id, status: "approve" })
        .populate({ path: 'chapters', populate: { path: 'lessons', populate: { path: 'content' } } })
        .populate({ path: 'instructor' })

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
        }


        res.status(200).json({
            status: "success",
            data: {
                ...course._doc,
                isBookmarked,
                isRegistered
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

    user.balance -= course.price
    course.num_registration += 1
    const user_course = await User_Course.findOne({
        user: req.user.id
    })

    if (!user_course.courses.includes(req.params.id)) {
        user_course.courses.push(req.params.id)

        await user_course.save()
        await user.save()
        await course.save()

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
        const course = await Course.findOneAndDelete({ _id: req.params.id })

        if (!course) {
            res.status(404).json({
                status: "fail",
                data: course,
                message: "Course not found"
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

module.exports = { getAllCourse, getCourseById, getCourseByInstructor, getDetailCourseByInstructor, createCourse, updateCourseByInstructor, buyCourse, checkRegistered, deleteCourse }
