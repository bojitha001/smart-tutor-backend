import express from "express"
import { addStudent, createOrUpdateStudent, createStudent, getALlStudents, getStudentById } from "../application/students";

const studentRouter = express.Router();

studentRouter.route('/').get(getALlStudents).post(addStudent).post(createStudent);
studentRouter.route('/:id').get(getStudentById);

export default studentRouter;