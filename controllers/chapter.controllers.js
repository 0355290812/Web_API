const Chapter = require('../models/chapter.models')

const createChapter = async (req, res) => {
    const chapter = await Chapter.create({
        title: req.body.title,
        lessons: []
    })

    if (!chapter) {
        res.status(500).json({
            status: "fail",
            message: "Create Fail"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: chapter,
        message: "Create Successfully"
    })
}

const getChapter = async (req, res) => {
    const chapter = await Chapter.findById(req.params.id).populate('lessons')

    if (!chapter) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Get Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: chapter,
        message: "Get Successfully"
    })
}

const updateChapter = async (req, res) => {
    const chapter = await Chapter.findOneAndUpdate({
        _id: req.params.id
    }, {
        title: req.body.title,
        lessons: req.body.lessons
    }, { new: true })

    if (!chapter) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Update Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: chapter,
        message: "Update Successfully"
    })
}

const deleteChapter = async (req, res) => {
    const chapter = await Chapter.findOneAndDelete({
        _id: req.params.id
    }, {
        title: req.body.title,
        lessons: req.body.lessons
    })

    if (!chapter) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Delete Failed"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: chapter,
        message: "Delete Successfully"
    })
}

module.exports = { createChapter, getChapter, deleteChapter, updateChapter }
