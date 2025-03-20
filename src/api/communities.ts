import express from "express"
import { addCommunity, getAllCommunities, getCommunityById } from "../application/communities";
import { requireAuth } from "@clerk/express";

const communityRouter = express.Router();

communityRouter.route('/').get(requireAuth(), getAllCommunities).post(requireAuth(), addCommunity);
communityRouter.route('/:id').get(requireAuth(), getCommunityById);

export default communityRouter;