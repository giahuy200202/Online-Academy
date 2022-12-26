import express from "express";
import * as instructorController from "../controllers/instructorController.js";
const router = express.Router();

router.route('/my-courses').get(instructorController.getMyCourses);
router.route('/add-course-description').get(instructorController.addCourseDescription);
router.route('/add-course-content').get(instructorController.addCourseContent);
router.post('/upload-lesson', instructorController.uploadLesson);

export default router;