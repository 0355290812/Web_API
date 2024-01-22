const Review = require('../models/review.models');
const Course = require('../models/course.models');
const User = require('../models/user.models');
const User_Course = require('../models/user_course.models');
const User_Instructor = require('../models/user_instructor.models');
const Instructor = require('../models/instructor.models');

const createReviewCourse = async (req, res) => {
    const  courseId  = req.params.id;
    const { content, star } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
        res.status(500).json({
            status: "failed",
            message: "Course does not exist"
        })
        return
    }
    const review = await Review.create({
        user: req.user.id,
        content: content,
        star: star
    })
    await course.reviews.push(review._id)
    const list_reviews = await course.populate('reviews')
    course.avg_rating = list_reviews.reviews.reduce((preValue, review) => preValue + review.star, 0) / course.reviews.length
    await course.save()
    res.status(200).json({
        status: "success",
        data: review,
        message: 'Create review successfully'
    })
}

const createReviewInstructor = async (req, res) => {
    const instructorId = req.params.id;
    const { content, star } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    const instructor = await Instructor.findOne({ _id: instructorId });
    if (!instructor) {
        res.status(500).json({
            status: "failed",
            message: "Instructor does not exist"
        })
        return
    }
    const review = await Review.create({
        user: req.user.id,
        content: content,
        star: star
    })
    await instructor.reviews.push(review._id)
    const list_reviews = await instructor.populate('reviews')
    instructor.avg_rating = list_reviews.reviews.reduce((preValue, review) => preValue + review.star, 0) / instructor.reviews.length
    await instructor.save()
    res.status(200).json({
        status: "success",
        data: review,
        message: 'Create review successfully'
    })
}
module.exports = { createReviewCourse, createReviewInstructor }