import express from "express"
import { addTeachers, deleteTeacher, getAllAvailableTeachers, getATeacherById, updateTeacher} from "../application/availableTeachers";

const teachersRouter = express.Router();

teachersRouter.route('/').get(getAllAvailableTeachers).post(addTeachers);
teachersRouter.route('/:id').get(getATeacherById).put(updateTeacher).delete(deleteTeacher);

export default teachersRouter; 