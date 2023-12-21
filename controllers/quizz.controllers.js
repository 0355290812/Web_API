const Quizz = require('../models/quizz.models')
const { findOneAndUpdate, findOne, findOneAndDelete } = require('../models/user.models')

const createQuizz = async (req, res) => {
    const quizz = await Quizz.create({
        list_question: req.body.list_question
    })

    res.status(200).json({
        status: "success",
        data: quizz,
        message: "Create Successful"
    })
}

const updateQuizz = async (req, res) => {
    const quizz = await Quizz.findOneAndUpdate({
        _id: req.params.id 
    }, {
        list_question: req.body.list_question
    }, { new: true })

    if (!quizz) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Quizz does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: quizz,
        message: "Updated"
    })
}

const getQuizz = async (req, res) => {
    const quizz = await Quizz.findOne({
        _id: req.params.id
    })

    if (!quizz) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Quizz does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: quizz,
        message: "Get Quizz"
    })
}

const deleteQuizz = async (req, res) => {
    const quizz = await Quizz.findOneAndDelete({
        _id: req.params.id
    })

    if (!quizz) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Quizz does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: quizz,
        message: "Deleted"
    })
}

module.exports = { createQuizz, getQuizz, updateQuizz, deleteQuizz }