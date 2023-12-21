const Lesson = require('../models/lesson.models')

const createLesson = async (req, res) => {
    const lesson = await Lesson.create({
        title: req.body.title,
        description: req.body.description,
        lessonType: req.body.lessonType,
        content: req.body.content
    })

    if (!lesson) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Create Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: lesson,
        message: "Create Successfully"
    })
}

const getLesson = async (req, res) => {
    const lesson = await Lesson.findById(req.params.id)

    if (!lesson) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: lesson,
        message: "Get Successfully"
    })
}

const updateLesson = async (req, res) => {
    const lesson = await Lesson.findOneAndUpdate({
        _id: req.params.id
    }, {
        title: req.body.title,
        description: req.body.description,
        lessonType: req.body.lessonType,
        content: req.body.content
    }, { new: true })

    if (!lesson) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Update Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: lesson,
        message: "Update Successfully"
    })
}

const deleteLesson = async (req, res) => {
    const lesson = await Lesson.findOneAndDelete({
        _id: req.params.id
    })

    if (!lesson) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Delete Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: lesson,
        message: "Delete Successfully"
    })
}

module.exports = { createLesson, getLesson, deleteLesson, updateLesson }
