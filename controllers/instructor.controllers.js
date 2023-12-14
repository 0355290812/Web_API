const Instructor = require('../models/instructor.models')
const User = require('../models/user.models')

const getAllInstructor = async (req, res) => {
    // const page_size = req.query.page_size || 20 
    // const page = req.query.page || 1
    // const search = req.query.search || ""
    // const sort = req.query.sort || "DSC" == "ASC" ? 1 : -1
    // const value_sort = req.query.value-sort || "avg_rating"
    // const status = req.query.status || "offline"
    try {
        const instructor = await Instructor.find({
            // title: {
            //     $regex: new RegExp(search, "i")
            // },
            // active_status: status
        })
        // .sort({ [value_sort]: sort })
        // .skip((page - 1) * page_size)
        // .limit(page_size)
    
        res.status(200).json({
            status: "success",
            data: instructor,
            message: 'Get all courses'    
        })
       
    } catch (error) {
        console.log(error);
    }
    
}

const getInstructorByID = async (req, res) => {
    const instructor_id = req.params.id

    try {
        const instructor = await Instructor.findById(id)
        const user = await User.findById(instructor.user_id)
        res.status(200).json({
            status: "success",
            data: {
                name: user.name,

            },
            message: "Get Success"
        })
    } catch (error) {
        console.log(error);
    }
}

const createInstructor = async (req, res) => {
    const checkInstructor = await Instructor.findOne({ user_id: req.user.id })

    if (checkInstructor && checkInstructor.status == "pending") {
        res.status(401).json({
            status: "waiting",
            data: [],
            message: "Awaiting approval"
        })
        return
    }
    
    const instructor = await Instructor.create({
        sector: req.body.sector,
        certificates: req.body.certificates,
        academic_level: req.body.academic_level,
        user_id: req.user.id,
        image: req.body.image
    })
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
        message: "Create Successfully" 
    })
}

const getInfo = async (req, res) => {
    const instructor = Instructor.findById(req.user.id).populate('user_id')
    res.status(200).json({
        status: "success",
        data: instructor,
        message: "Success"
    })
}
const updateInfo = async (req, res) => {
    if (req.body.image) {
        const instructor = await Instructor.findOneAndUpdate({ user_id: req.user.id },{
            image: req.body.image
        })
    }

    if (req.body.user) {
        const user = await User.findByIdAndUpdate(req.user.id, {
            name: req.body.name
        })
    }

    res.status(200).json({
        status: "Success",
        data: instructor,
        message: "Information has been changed"
    })
}
module.exports = { getAllInstructor, getInstructorByID, createInstructor, getInfo, updateInfo }
