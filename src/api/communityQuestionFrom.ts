import express from "express"
import { createCommunityQuestionForm, getCommunityQuestionForm, getCommunityQuestionFormById } from "../application/communityQuestionFrom";

const communityQuestionFormRouter = express.Router();

communityQuestionFormRouter.route('/').get(getCommunityQuestionForm).post(createCommunityQuestionForm);
communityQuestionFormRouter.route('/:id').get(getCommunityQuestionFormById);

export default communityQuestionFormRouter;