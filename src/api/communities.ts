import express from "express"
import { addCommunity, getAllCommunities, getCommunityById } from "../application/communities";

const communityRouter = express.Router();

communityRouter.route('/').get(getAllCommunities).post(addCommunity);
communityRouter.route('/:id').get(getCommunityById);

export default communityRouter;