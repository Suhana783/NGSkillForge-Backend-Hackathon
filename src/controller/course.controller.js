const {
    createCourseService,
    updateCourseService,
    getAllCourseService,
    getCourseService,
    deleteCourseService
} = require('../services/course.service.js')


exports.createCourse = async (req, res) => {

    try {

        const course = await createCourseService(req.body);
        res.status(201).json({
            success: true,
            message: "course is created successfully",
            data: course
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const update = await updateCourseService(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "updated successfully",
            data: update
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Course not found",
        })
    }
};


exports.getAllCourses = async (req, res) => {
    try {
        const getCourses = await getAllCourseService()
        res.status(200).json({
            success: true,
            message: "All course here",
            data: getCourses
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Not found"
        })
    }
};

exports.getCourse = async (req, res) => {
    try {
        const oneCourse = await getCourseService(req.params.id)
        res.status(200).json({
            success: true,
            data: oneCourse
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message:"Course not found"
        })
    }
};

exports.deleteCourse = async (req, res) => {

    try {
        const deleteCourseById = await deleteCourseService(req.params.id)
        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message:"Check id"
        })
    }
};