const Course = require('../model/course.model');

const createCourseService = async (courseData) => {
    const newCourse = await Course.create(courseData)
    return newCourse;
};


const updateCourseService = async (courseId, updateData) => {

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updateData,
        { new: true }
    );

    return updatedCourse;
};


const getAllCourseService = async () => {
    const allCourses = await Course.find();
    return allCourses; 
};


const getCourseService = async (ID) => {
    const course = await Course.findById(ID);
    return course;
};


const deleteCourseService = async (deleteCourse) => {

    const deleteCourseById = await Course.findByIdAndDelete(deleteCourse);
    return deleteCourseById;
};