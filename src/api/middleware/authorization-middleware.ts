import ForbiddenError from "../../domain/errors/forbidden-error";
import { NextFunction, Request, Response } from "express";

const AuthorizationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        if(req.auth.claims.metadata.role !== "admin" || req.auth.claims.metadata.role !== "tutor" || req.auth.claims.metadata.role !== "student"){
            throw new ForbiddenError("Logged user only route");
        }
        next();
    };

export default AuthorizationMiddleware;