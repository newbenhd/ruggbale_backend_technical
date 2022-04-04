// Testing Controllers
// 💯 Test everything else

import {
  buildRes,
  buildReq,
  buildNext,
  buildPlanQuery,
} from "../../test/generate";
import { Request, Response, NextFunction } from "express";
import * as db from "../../db/index";
import * as rollPlansController from "../roll-plans-controller";

jest.mock("../../db/index");

beforeEach(() => {
  jest.resetAllMocks();
});

test("getNextRollPlans returns with correct req and res. it should run db", async () => {
  const plans = buildPlanQuery();
  // @ts-ignore
  db.pool.query.mockResolvedValueOnce({
    rows: plans,
    rowCount: plans.length,
  });
  const req = buildReq({
    query: {
      include_rush: false,
      roll_length: 14,
    },
  }) as Request;
  const res = buildRes() as Response;
  const next = buildNext(undefined) as NextFunction;
  await rollPlansController.getNextRollPlans(req, res, next);

  expect(db.pool.query).toHaveBeenCalledWith(
    rollPlansController.getNextRollQuery()
  );
  expect(db.pool.query).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
});
test("getNextRollPlans returns with correct req, res. it should run db", async () => {
  const plans = buildPlanQuery();
  // @ts-ignore
  db.pool.query.mockResolvedValueOnce({
    rows: plans,
    rowCount: plans.length,
  });
  const req = buildReq({
    query: {
      include_rush: true,
      roll_length: 14,
    },
  }) as Request;
  const res = buildRes() as Response;
  const next = buildNext(undefined) as NextFunction;
  await rollPlansController.getNextRollPlans(req, res, next);
  expect(db.pool.query).toHaveBeenCalledWith(
    rollPlansController.getNextRollQuery({ rush: true })
  );
  expect(db.pool.query).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
});
test("getNextRollPlans returns with bad req, res & should not run db", async () => {
  const plans = buildPlanQuery();
  // @ts-ignore
  db.pool.query.mockResolvedValueOnce({
    rows: plans,
    rowCount: plans.length,
  });
  const req = buildReq({
    query: {
      roll_length: "abc",
    },
  }) as Request;
  const res = buildRes() as Response;
  const next = buildNext(undefined) as NextFunction;
  await rollPlansController.getNextRollPlans(req, res, next);
  // expect(db.pool.query).toHaveBeenCalledWith(
  //   rollPlansController.getNextRollQuery()
  // );
  expect(db.pool.query).toHaveBeenCalledTimes(0);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);
});
