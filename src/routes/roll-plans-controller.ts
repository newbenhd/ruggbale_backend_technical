import { Request, Response, NextFunction } from "express";
import { pool } from "../db/index";
import { query, check, validationResult } from "express-validator";
import { PlanType } from "../db/types";
import { slicePlans } from "./utils/slicePlans";

function validateQuery(name: string) {
  switch (name) {
    case "roll_length":
      return query(name)
        .exists()
        .withMessage(`${name} not provided`)
        .bail()
        .notEmpty()
        .withMessage(`${name} should not be empty`)
        .bail()
        .escape()
        .isNumeric()
        .withMessage(`${name} should be number`)
        .bail()
        .isInt({ min: 0 })
        .withMessage(`${name} should be greater than or equal to 0`);

    case "include_rush":
      return query(name)
        .optional()
        .notEmpty()
        .withMessage(`${name} should not be empty`)
        .bail()
        .escape()
        .isBoolean()
        .withMessage(`${name} should be boolean`);
    default:
      return {
        run: (req: any) =>
          new Promise((resolve, rej) => {
            resolve(void 0);
          }),
      };
  }
}

export function getNextRollQuery(
  option = {
    rush: false,
  }
) {
  const { rush } = option;
  // no need to sanitize the query
  const rushQuery = rush
    ? 'ORDER BY line_item.rush DESC, "order".order_date ASC'
    : 'AND line_item.rush = false ORDER BY "order".order_date';
  const query =
    "SELECT line_item.sku, line_item.rush, component.id, component.size, " +
    '"order".order_date FROM line_item, component, "order" WHERE component.line_item_id = line_item.id AND line_item.order_id = "order".id AND component.status=' +
    "'Pending' AND " +
    '"order".cancelled = false ' +
    rushQuery;
  return query;
}

export interface NextRollRequest extends Request {
  // include_rush: "true" | "false";
  // roll_length: string;
  model?: {
    roll_id: number;
    length: number;
    plan: PlanType[];
  };
}
async function getNextRollPlans(
  req: NextRollRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await validateQuery("include_rush").run(req);
    await validateQuery("roll_length").run(req);
    await check("include_rush").toBoolean().run(req);
    await check("roll_length").toInt().run(req);
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(404).json({ errors: result.array() });
    // @ts-ignore
    const {
      include_rush,
      roll_length,
    }: { include_rush: boolean; roll_length: number } = req.query;
    const query = getNextRollQuery({
      rush: include_rush,
    });
    const { rows } = await pool.query(query);
    const { plan, length } = slicePlans(roll_length, rows);
    res.status(200).json({
      roll_id: 123,
      length,
      plan,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export { getNextRollPlans };
