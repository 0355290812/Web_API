const Video = require('../models/video.models')

const createVideo = async (req, res) => {
    const video = await Video.create({
        url: req.body.url
    })

    res.status(200).json({
        status: "success",
        data: video,
        message: "Create Successful"
    })
}

const deleteVideo = async (req, res) => {
    const video = await Video.findOneAndDelete({ _id: req.params.id })

    if (!video) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Video does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: video,
        message: "Delete Successful"
    })
}

const updateVideo = async (req, res) => {
    const video = await Video.findOneAndUpdate({ 
        _id: req.params.id 
    },
    {
        url: req.body.url
    }, { new: true })

    if (!video) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Video does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: video,
        message: "Update Successful"
    })
}

const getVideo = async (req, res) => {
    const video = await Video.findOne({ _id: req.params.id})

    if (!video) {
        res.status(500).json({
            status: "failed",
            data: [],
            message: "Video does not exist"
        })
        return
    }

    res.status(200).json({
        status: "success",
        data: video,
        message: "Get Video"
    })
}

module.exports = { createVideo, deleteVideo, getVideo, updateVideo }
