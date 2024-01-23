const Instructor = require('../models/instructor.models')
const User = require('../models/user.models')
const review = require('../models/review.models')
const User_Instructor = require('../models/user_instructor.models')
const Rent = require('../models/rent.models')

const getAllInstructor = async (req, res) => {
    const page_size = req.query.page_size || 20
    const page = req.query.page || 1
    const search = req.query.search || ""
    const sort = (req.query.sort || "DSC") == "ASC" ? 1 : -1
    const value_sort = req.query.value_sort || "num_registration"
    const status = req.query.status
    const users = await User.find({
        role: "instructor",
        name: {
            $regex: search, $options: 'i'
        }
    }, {
        select: '_id'
    })
    try {
        if (status == "online" || status == "offline") {
            const instructor = await Instructor.find({
                active_status: status,
                $or: [
                    {
                        user: {
                            $in: users
                        }
                    },
                    {
                        subjects: {
                            $regex: search, $options: 'i'
                        }
                    }
                ]
            })
                .sort({ [value_sort]: sort })
                .skip((page - 1) * page_size)
                .limit(page_size)
                .populate('user')

            res.status(200).json({
                status: "success",
                data: instructor,
                message: 'Get all instructors'
            })
        } else {
            const instructor = await Instructor.find({
                $or: [
                    {
                        user: {
                            $in: users
                        }
                    },
                    {
                        subjects: {
                            $regex: search, $options: 'i'
                        }
                    }
                ]
            })
                .sort({ [value_sort]: sort })
                .skip((page - 1) * page_size)
                .limit(page_size)
                .populate('user')

            res.status(200).json({
                status: "success",
                data: instructor,
                message: 'Get all instructors'
            })
        }

    } catch (error) {
        console.log(error);
    }

}

const getInstructorByID = async (req, res) => {

    try {
        const instructor = await Instructor.findOne({ _id: req.params.id }).populate('user').populate({ path: 'reviews', populate: { path: 'user' } })

        let isFollowed = false
        let hasReview = false
        if (req.user) {
            const user_instructor = await User_Instructor.findOne({ user: req.user.id })
            if (user_instructor && user_instructor.instructors.includes(req.params.id)) {
                isFollowed = true
            } else {
                isFollowed = false
            }
            const rent = await Rent.findOne({ user: req.user.id, instructor: req.params.id, status: {$ne: "rejected"} })
            if (rent) {
                instructor.reviews.forEach(review => {
                if (review.user._id == req.user.id) {
                    hasReview = true
                }
            })
            }
            
        } else {
            isFollowed = false
            hasReview = true
        }
        res.status(200).json({
            status: "success",
            data: {
                ...instructor._doc,
                isFollowed: isFollowed,
                hasReview: hasReview
            },
            message: "Get Success"
        })
    } catch (error) {
        console.log(error);
    }
}

const createInstructor = async (req, res) => {

    let certificates = req.body.certificates.map((item, index) => {
        return { name: item, image: req.files.certificates[index].path }
    })
    let academic_level = req.body.academic_level.map((item, index) => {
        return { name: item, image: req.files.academic_level[index].path }
    })
    const instructor = await Instructor.findOneAndUpdate({
        user: req.user.id
    }, {
        subjects: req.body.subjects,
        certificates: certificates,
        academic_level: academic_level,
        user: req.user.id,
        status: "pending",
        active_status: "offline"
    }, { upsert: true, new: true })

    if (!instructor) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Create Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: instructor,
        message: "Awaiting approval"
    })
}

const getStatusInstructor = async (req, res) => {
    const instructor = await Instructor.findOne({
        user: req.user.id
    })

    if (!instructor) {
        res.status(200).json({
            status: "success",
            data: {
                status: "unregister"
            }
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: {
            status: instructor.status
        }
    })

}

const getInfo = async (req, res) => {
    const instructor = await Instructor.findOne({ user: req.user.id }).populate('user')
    res.status(200).json({
        status: "success",
        data: instructor,
        message: "Success"
    })
}
const updateInfo = async (req, res) => {
    const instructor = await Instructor.findOneAndUpdate({
        user: req.user.id
    }, {
        subjects: req.body.subjects,
        description: req.body.description,
        active_status: req.body.active_status,
        price: req.body.price
    }, { new: true }).populate('user')

    if (req.files && req.files.image) {
        const user = await User.findOneAndUpdate({
            _id: req.user.id
        }, {
            image: req.files.image[0].path,
        }, { new: true })
    }

    res.status(200).json({
        status: "Success",
        data: instructor,
        message: "Information has been changed"
    })
}

const updateStatus = async (req, res) => {
    const instructor = await Instructor.findOneAndUpdate({
        user: req.user.id
    }, {
        active_status: req.body.active_status
    }, { new: true })

    res.status(200).json({
        status: "success",
        data: instructor
    })
}

const updateFollowInstructor = async (req, res) => {

    const user_instructor = await User_Instructor.findOne({ user: req.user.id })
    const instructor = await Instructor.findOne({ _id: req.params.id })

    if (req.user.id == instructor.user) {
        res.status(500).json({
            status: "failed",
            message: "You can't follow yourself"
        })
        return
    }
    if (!user_instructor) {
        res.status(500).json({
            status: "failed",
            message: "User not found"
        })
        return
    }
    if (user_instructor.instructors.includes(req.params.id)) {
        user_instructor.instructors.splice(user_instructor.instructors.indexOf(req.params.id), 1)
        instructor.follower -= 1
    } else {
        user_instructor.instructors.push(req.params.id)
        instructor.follower += 1
    }

    await user_instructor.save()
    await instructor.save()

    res.status(200).json({
        status: "success",
        data: user_instructor,
        message: "Update success"
    })
}

const getFollowingInstructor = async (req, res) => {
    const user_instructor = await User_Instructor.findOne({ user: req.user.id }).populate({ path: 'instructors', populate: { path: 'user' } })

    if (!user_instructor) {
        res.status(500).json({
            status: "failed",
            message: "User not found"
        })
        return
    }

    if (req.query.status == "online" || req.query.status == "offline") {
        const instructors = await Instructor.find({
            _id: {
                $in: user_instructor.instructors
            },
            active_status: req.query.status
        }).populate('user')

        res.status(200).json({
            status: "success",
            data: instructors,
            message: "Get success"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: user_instructor.instructors,
        message: "Get success"
    })
}

const getAllInstructorByAdmin = async (req, res) => {
    const page_size = req.query.page_size || 20
    const page = req.query.page || 1
    const search = req.query.search || ""
    const users = await User.find({
        role: "instructor",
        name: {
            $regex: search, $options: 'i'
        }
    }, {
        select: '_id'
    })
    
            const instructors = await Instructor.find({
                $or: [
                    {
                        user: {
                            $in: users
                        }
                    },
                    {
                        subjects: {
                            $regex: search, $options: 'i'
                        }
                    }
                ]
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size)
            const totalSize = await Instructor.find(
                    {
                        user: {
                            $in: users
                        }
                    }).countDocuments()
            res.status(200).json({
                status: "success",
                data: { instructors, totalSize },
                message: 'Get all instructors'
            })
}

const getAllUsers = async (req, res) => {
    const search = req.query.search == "undefined" ? "" : req.query.search
    const name = req.query.name == "undefined" ? "" : req.query.name
    const page = req.query.page || 1
    const page_size = req.query.page_size || 10
    let totalSize = 0;
    let users = []
    if (search !== "undefined") {
        users = await User.find({ role: { $ne: "admin" }, name: { $regex: new RegExp(name, "iu") }, username: { $regex: new RegExp(search, "iu") } }).select("-password")
            .skip((page - 1) * page_size)
            .limit(page_size)
            .sort({ createdAt: -1 })
        totalSize = await User.find({ role: { $ne: "admin" }, name: { $regex: new RegExp(name, "iu") }, username: { $regex: new RegExp(search, "iu") } }).select("-password").countDocuments()

    } else {
        users = await User.find({ role: { $ne: "admin" } }).select("-password")
            .skip((page - 1) * page_size)
            .limit(page_size)
            .sort({ createdAt: -1 })
        totalSize = await User.find({ role: { $ne: "admin" }, name: { $regex: new RegExp(name, "iu") }, username: { $regex: new RegExp(search, "iu") } }).select("-password").countDocuments()
    }

    res.status(200).json({
        status: "success",
        data: {
            users,
            totalSize
        },
        message: "Get all users successfully"
    })
}

const getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password")

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get user failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: user,
        message: "Success"
    })
}

const updateUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get user failed"
        })
        return
    }

    user.name = req.body.name
    // user.role = req.body.role
    await user.save()

    res.status(200).json({
        status: "success",
        data: user,
        message: "Update user successfully"
    })
}

const deleteUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Delete user failed"
        })
        return
    }

    if (user.role === "instructor") {
        const instructor = await Instructor.findOneAndDelete({ user: user.id })
        const courses = await Course.find({ instructor: user.id })
        courses.forEach(async (course) => {
            if (course.chapters) {
                course.chapters.forEach(async (chapter) => {
                    const subChapter = await Chapter.findOne({ _id: chapter })
                    if (subChapter.lessons) {
                        subChapter.lessons.forEach(async (lesson) => {
                            const subLesson = await Lesson.findOne({ _id: lesson })
                            if (lesson.lessonType === "video") {
                                const video = await Video.findOneAndDelete({ _id: subLesson.content })
                            } else {
                                const quiz = await Quiz.findOneAndDelete({ _id: subLesson.content })
                            }
                            await subLesson.remove()
                        })
                    }
                    await Chapter.deleteOne({ _id: chapter })
                })
            }
            await Course.deleteOne({ _id: course.id })
        })
    }
    await User.deleteOne({ _id: user.id })

    res.status(200).json({
        status: "success",
        data: user,
        message: "Delete user successfully"
    })
}

const createUserByAdmin = async (req, res) => {
    const hash = await hashPassword(req.body.password)

    const usernameExist = await User.findOne({ username: req.body.username })
    if (usernameExist) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Username already exist"
        })
        return
    }

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Email already exist"
        })
        return
    }

    const user = await User.create({
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        balance: req.body.balance,
        role: req.body.role
    })

    if (req.body.role === "student") {
        const bookmarked = await Bookmarked.create({ user: user.id })
        const user_course = await User_Course.create({ user: user.id })
        const user_instructor = await User_Instructor.create({ user: user.id })
    }
    res.status(200).json({
        status: "success",
        data: user
    })
}
module.exports = { 
    getAllInstructor, 
    getInstructorByID, 
    createInstructor, 
    getInfo, 
    updateInfo, 
    getStatusInstructor, 
    updateFollowInstructor, 
    getFollowingInstructor, 
    updateStatus, 
    getAllInstructorByAdmin 
}
