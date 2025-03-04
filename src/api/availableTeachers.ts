import express from "express"
import { addTeachers, getAllAvailableTeachers, getATeacherById} from "../application/availableTeachers";

const teachersRouter = express.Router();

teachersRouter.route('/').get(getAllAvailableTeachers).post(addTeachers);
teachersRouter.route('/:id').get(getATeacherById);

export default teachersRouter; 