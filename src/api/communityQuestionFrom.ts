import express from "express"
import { createCommunityQuestionForm, getCommunityQuestionForm, getCommunityQuestionFormById } from "../application/communityQuestionFrom";
import { requireAuth } from "@clerk/express";
// import AuthorizationMiddleware from "./middleware/authorization-middleware";

const communityQuestionFormRouter = express.Router();

communityQuestionFormRouter.route('/').get(requireAuth(), getCommunityQuestionForm).post(requireAuth(), createCommunityQuestionForm);
communityQuestionFormRouter.route('/:id').get(requireAuth(), getCommunityQuestionFormById);

export default communityQuestionFormRouter;