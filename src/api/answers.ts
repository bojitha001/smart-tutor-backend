import express from "express"
import { addAnswer, getAnswerByQuestionId } from "../application/answers"

const answersRouter = express.Router();

answersRouter.route('/').post(addAnswer).get(getAnswerByQuestionId);


export default answersRouter;