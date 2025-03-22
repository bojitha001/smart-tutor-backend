import express from "express"
import { addClass, getAllClasses, getClass, getClassById } from "../application/classes";

const classesRouter = express.Router();

classesRouter.route('/').post(addClass).get(getClass).get(getAllClasses);
classesRouter.route('/:id').get(getClassById);

export default classesRouter;