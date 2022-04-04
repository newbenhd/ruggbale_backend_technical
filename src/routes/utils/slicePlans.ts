import { PlanType, PlanTypeQuery } from "../../db/types";

const sizeTable: { [key: string]: number[] } = {
  "2.5x7": [2.5, 7],
  "3x5": [5, 3],
  "5x7": [5, 7],
};
/**
 * Slice the plans by length
 *  - Add position to each sliced plan
 *  - Place two subsequent 2.5x7 on same position
 * Track of sliced plan length
 */
export function slicePlans(
  length: number,
  plans: PlanTypeQuery[]
): { plan: PlanType[]; length: number } {
  // Edge cases
  if (length <= 0 && plans.length === 0) return { plan: [], length: 0 };

  let placeholder_i = -1;
  let position = 1;
  const sliced = [] as (PlanType | Symbol)[];
  let i = 0;
  let rollLength = 0;

  // store pointer for next 2.5x7 component
  while (length > 0 && i < plans.length) {
    const plan = {
      ...plans[i++],
      position,
    };
    const [w, l] = sizeTable[plan.size];
    if (w === 2.5 && placeholder_i >= 0) {
      sliced.splice(placeholder_i, 1, {
        ...plan,
        // @ts-ignore
        position: sliced[placeholder_i - 1].position,
      });
      placeholder_i = -1;
    } else {
      if (length - l < 0) break;
      if (w === 2.5) {
        sliced.push(plan, slicePlans.placeholder);
        placeholder_i = sliced.length - 1;
      } else sliced.push(plan);
      position++;
      length -= l;
      rollLength += l;
    }
  }
  // Fill the placeholder
  if (placeholder_i >= 0) {
    const plan = plans.slice(i).find((plan) => plan.size === "2.5x7");
    if (plan) {
      sliced.splice(placeholder_i, 1, {
        ...plan,
        // @ts-ignore
        position: sliced[placeholder_i - 1].position,
      });
    } else {
      sliced.splice(placeholder_i, 1);
    }
  }
  return {
    plan: sliced as PlanType[],
    length: rollLength,
  };
}
slicePlans.placeholder = Symbol("slicePlans");
