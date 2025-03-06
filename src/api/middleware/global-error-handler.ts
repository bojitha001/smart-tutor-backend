import { NextFunction } from "express";

const GlobalErrorHandlingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
      console.log("OOPS");
      next();
};

export default GlobalErrorHandlingMiddleware;