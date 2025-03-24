import express from "express"
import { addStudent, updateStudent, getAllStudents, getStudentById } from "../application/students";

const studentRouter = express.Router();

studentRouter.route('/').get(getAllStudents).post(addStudent);
studentRouter.route('/:id').get(getStudentById).put(updateStudent);

export default studentRouter;