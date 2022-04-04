import { slicePlans } from "../utils/slicePlans";
import { buildPlanQuery } from "../../test/generate";
import cases from "jest-in-case";

function casify(obj: { [key: string]: any }) {
  return Object.entries(obj).map(([name, { length, plans, ...others }]) => ({
    name,
    length,
    plans,
    ...others,
  }));
}

cases(
  "slicePlans: bad inputs",
  (options) => {
    const { plan } = slicePlans(options.length, options.plans);
    expect(plan).toHaveLength(0);
  },
  casify({
    "Input length equal to 0 should return []": {
      length: 0,
      plans: [],
    },
    "Input length less than 0 should return []": {
      length: -3,
      plans: [],
    },
  })
);

const nonrushPlans = buildPlanQuery();
const rushPlans = buildPlanQuery({ rush: true });

cases(
  "slicePlans: correct sliced lengths and roll length w/ rush = true",
  ({ length, plans, slicedLength, rollLength }) => {
    const { plan, length: planRollLength } = slicePlans(length, plans);
    expect(plan.length).toBe(slicedLength);
    expect(planRollLength).toBe(rollLength);
  },
  casify({
    "Input length 12 should return sliced length of 3 and roll length of 10": {
      length: 12,
      plans: rushPlans,
      slicedLength: 3,
      rollLength: 10,
    },
    "Input length 5 should return sliced length of 1 and roll lengh of 3": {
      length: 5,
      plans: rushPlans,
      slicedLength: 1,
      rollLength: 3,
    },
    "Input length 100 should return sliced length of 7 and roll length of 27": {
      length: 100,
      plans: rushPlans,
      slicedLength: 7,
      rollLength: 27,
    },
    "Input length 19 should return sliced length of 4 and roll length of 17": {
      length: 19,
      plans: rushPlans,
      slicedLength: 4,
      rollLength: 17,
    },
    "Input length 26 should return sliced length of 6 and roll length of 24": {
      length: 26,
      plans: rushPlans,
      slicedLength: 6,
      rollLength: 24,
    },
    "Input length 27 should return sliced length of 7 and roll length of 27": {
      length: 27,
      plans: rushPlans,
      slicedLength: 7,
      rollLength: 27,
    },
    "Input length of 3 should return sliced length of 0 and roll length of 3": {
      length: 3,
      plans: rushPlans,
      slicedLength: 1,
      rollLength: 3,
    },
  })
);
cases(
  "slicePlans: correct sliced lengths & roll length w/ rush = false",
  ({ length, plans, slicedLength, rollLength }) => {
    const { plan, length: planRollLength } = slicePlans(length, plans);
    expect(plan.length).toBe(slicedLength);
    expect(planRollLength).toBe(rollLength);
  },
  casify({
    "Input length 14 should return sliced length of 3": {
      length: 14,
      plans: nonrushPlans,
      slicedLength: 3,
      rollLength: 14,
    },
    "Input length 13 should return sliced length of 1": {
      length: 13,
      plans: nonrushPlans,
      slicedLength: 1,
      rollLength: 7,
    },
    "Input length 7 should return sliced length of 1": {
      length: 7,
      plans: nonrushPlans,
      slicedLength: 1,
      rollLength: 7,
    },
    "Input length 19 should return sliced length of 4": {
      length: 19,
      plans: nonrushPlans,
      slicedLength: 4,
      rollLength: 17,
    },
    "Input length 5 should return sliced length of 0": {
      length: 5,
      plans: nonrushPlans,
      slicedLength: 0,
      rollLength: 0,
    },
  })
);
cases(
  "slicePlans: correct order of sliced plans",
  ({ length, plans, orderById }) => {
    const { plan } = slicePlans(length, plans);
    const planByIds = plan.map((component) => component.id);
    expect(planByIds).toEqual(orderById);
  },
  casify({
    "nonrush sliced plans should have correct order": {
      length: 100,
      plans: nonrushPlans,
      orderById: [2, 1, 3, 7, 8],
    },
    "rush sliced plans should have correct order": {
      length: 100,
      plans: rushPlans,
      orderById: [4, 6, 1, 2, 3, 8, 7],
    },
  })
);
cases(
  "slicePlans: correct position placed on each sliced plan",
  ({ plans, length, positions }) => {
    const { plan } = slicePlans(length, plans);
    const planByPosition = plan.map((component) => component.position);
    expect(planByPosition).toEqual(positions);
  },
  casify({
    "nonrush sliced plans should have correct position": {
      length: 100,
      plans: nonrushPlans,
      positions: [1, 2, 2, 3, 4],
    },
    "rush sliced plans should have correct position": {
      length: 100,
      plans: rushPlans,
      positions: [1, 2, 2, 3, 4, 4, 5],
    },
  })
);
