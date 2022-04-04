import {
  ComponentType,
  OrderType,
  LineItemType,
  PlanTypeQuery,
} from "../db/types";

function buildComponent(): ComponentType[] {
  return [
    {
      id: 1,
      line_item_id: 1,
      status: "Pending",
      size: "2.5x7",
    },
    {
      id: 2,
      line_item_id: 2,
      status: "Pending",
      size: "5x7",
    },
    {
      id: 3,
      line_item_id: 3,
      status: "Pending",
      size: "2.5x7",
    },
    {
      id: 4,
      line_item_id: 4,
      status: "Pending",
      size: "3x5",
    },
    {
      id: 5,
      line_item_id: 5,
      status: "Cancelled",
      size: "5x7",
    },
    {
      id: 6,
      line_item_id: 6,
      status: "Pending",
      size: "2.5x7",
    },
    {
      id: 7,
      line_item_id: 7,
      status: "Pending",
      size: "3x5",
    },
    {
      id: 8,
      line_item_id: 8,
      status: "Pending",
      size: "2.5x7",
    },
  ];
}
function buildLineItem(): LineItemType[] {
  return [
    {
      id: 1,
      sku: "RC-0027-27",
      rush: false,
      order_id: 1,
    },
    {
      id: 2,
      sku: "RC-0030-57",
      rush: false,
      order_id: 1,
    },
    {
      id: 3,
      sku: "RC-DY25-27",
      rush: false,
      order_id: 2,
    },
    {
      id: 4,
      sku: "RS-MY18-35",
      rush: true,
      order_id: 3,
    },
    {
      id: 5,
      sku: "RS-BS73-57",
      rush: false,
      order_id: 4,
    },
    {
      id: 6,
      sku: "RS-DS55-27",
      rush: true,
      order_id: 5,
    },
    {
      id: 7,
      sku: "RC-IH17-35",
      rush: false,
      order_id: 5,
    },
    {
      id: 8,
      sku: "RS-AH27-27",
      rush: false,
      order_id: 6,
    },
  ];
}
function buildOrder(): OrderType[] {
  return [
    {
      id: 1,
      order_number: 2562,
      order_date: "2020-10-13T04:27:30",
      cancelled: false,
    },
    {
      id: 2,
      order_number: 2563,
      order_date: "2020-10-14T09:14:30",
      cancelled: false,
    },
    {
      id: 3,
      order_number: 2564,
      order_date: "2020-10-14T10:10:10",
      cancelled: false,
    },
    {
      id: 4,
      order_number: 2565,
      order_date: "2020-10-15T10:10:32.1",
      cancelled: true,
    },
    {
      id: 5,
      order_number: 2566,
      order_date: "2020-10-16T10:27:30",
      cancelled: false,
    },
    {
      id: 6,
      order_number: 2567,
      order_date: "2020-10-17T19:25:00",
      cancelled: false,
    },
  ];
}
function buildPlanQuery(
  option = {
    rush: false,
  }
): PlanTypeQuery[] {
  const plan = [
    {
      sku: "RS-MY18-35",
      rush: true,
      id: 4,
      size: "3x5",
      order_date: "2020-10-14T17:10:10.000Z",
    },
    {
      sku: "RS-DS55-27",
      rush: true,
      id: 6,
      size: "2.5x7",
      order_date: "2020-10-16T17:27:30.000Z",
    },
    {
      sku: "RC-0030-57",
      rush: false,
      id: 2,
      size: "5x7",
      order_date: "2020-10-13T11:27:30.000Z",
    },
    {
      sku: "RC-0027-27",
      rush: false,
      id: 1,
      size: "2.5x7",
      order_date: "2020-10-13T11:27:30.000Z",
    },
    {
      sku: "RC-DY25-27",
      rush: false,
      id: 3,
      size: "2.5x7",
      order_date: "2020-10-14T16:14:30.000Z",
    },
    {
      sku: "RC-IH17-35",
      rush: false,
      id: 7,
      size: "3x5",
      order_date: "2020-10-16T17:27:30.000Z",
    },
    {
      sku: "RS-AH27-27",
      rush: false,
      id: 8,
      size: "2.5x7",
      order_date: "2020-10-18T02:25:00.000Z",
    },
  ];
  return option.rush ? plan : plan.filter(({ rush }) => !rush);
}

function buildReq({ ...overrides } = {}) {
  const req = { body: {}, params: {}, ...overrides };
  return req;
}

function buildRes(overrides = {}) {
  const res: {
    json: jest.FunctionLike;
    status: jest.FunctionLike;
  } = {
    json: jest.fn(() => res).mockName("json"),
    status: jest.fn(() => res).mockName("status"),
    ...overrides,
  };
  return res;
}

function buildNext(impl: ((...args: any[]) => unknown) | undefined) {
  return jest.fn(impl).mockName("next");
}

export {
  buildComponent,
  buildOrder,
  buildLineItem,
  buildReq,
  buildRes,
  buildNext,
  buildPlanQuery,
};
