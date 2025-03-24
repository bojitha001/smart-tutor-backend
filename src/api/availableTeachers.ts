import express from "express"
import { addTeachers, deleteTeacher, getAllAvailableTeachers, getATeacherById, updateTeacher} from "../application/availableTeachers";
import { requireAuth } from "@clerk/express";

const teachersRouter = express.Router();

teachersRouter.route('/').get(getAllAvailableTeachers).post(requireAuth(), addTeachers);
teachersRouter.route('/:id').get(requireAuth(), getATeacherById).put(updateTeacher).delete(deleteTeacher);

export default teachersRouter; 
