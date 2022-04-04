import { ErrorRequestHandler } from "express";

class UnauthorizedError {
  code: number;
  message: string;
  constructor() {
    this.code = 0;
    this.message = "";
  }
}
const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  // console.log("error middleware - ", req, res);
  if (res.headersSent) {
    next(error);
  } else if (error instanceof UnauthorizedError) {
    res.status(401);
    res.json({ code: error.code, message: error.message });
  } else {
    res.status(500);
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(process.env.NODE_ENV === "production"
        ? null
        : { stack: error.stack }),
    });
  }
};

export default errorMiddleware;
