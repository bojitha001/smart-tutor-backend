import express from "express"
import { addCommunity, getAllCommunities, getCommunityById, updateCommunity } from "../application/communities";
import { requireAuth } from "@clerk/express";

const communityRouter = express.Router();

communityRouter.route('/').get(getAllCommunities).post(addCommunity);
communityRouter.route('/:id').get(getCommunityById).put(updateCommunity);

export default communityRouter;