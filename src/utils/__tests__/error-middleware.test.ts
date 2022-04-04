import { Request, Response } from "express";
import { buildRes, buildReq, buildNext } from "../../test/generate";
import errorMiddleware from "../error-middleware";

test("calls next if headersSent is true", () => {
  const req = buildReq() as Request;
  const res = buildRes({ headersSent: true }) as Response;
  const next = buildNext(undefined);
  const error = new Error("Some error message");
  errorMiddleware(error, req, res, next);
  expect(next).toHaveBeenCalledWith(error);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});

test("responds with 500 and the error object", () => {
  const req = buildReq() as Request;
  const res = buildRes() as Response;
  const next = buildNext(undefined);
  const error = new Error("some error message");
  errorMiddleware(error, req, res, next);
  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: error.stack,
  });
  expect(res.json).toHaveBeenCalledTimes(1);
});
