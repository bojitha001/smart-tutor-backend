import ForbiddenError from "../../domain/errors/forbidden-error";
import { NextFunction, Request, Response } from "express";

const AuthorizationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        const roles = (req as any).auth?.claims?.metadata?.role;

        if(roles !== "tutor" && roles !== "student"){
            throw new ForbiddenError("Logged user only route");
        }
        next();
    };

export default AuthorizationMiddleware;