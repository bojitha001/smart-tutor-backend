import express from "express"
import { updateUserRole } from "../application/user";
import { requireAuth } from "@clerk/express";
// import AuthorizationMiddleware from "./middleware/authorization-middleware";

const updateUserRoleRouter = express.Router();

updateUserRoleRouter.route('/').post(updateUserRole);

export default updateUserRoleRouter;