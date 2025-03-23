import express from "express"
import { addStudent, getALlStudents, getStudentById } from "../application/students";

const studentRouter = express.Router();

studentRouter.route('/').get(getALlStudents).post(addStudent);
studentRouter.route('/:id').get(getStudentById);

export default studentRouter;