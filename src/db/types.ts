export type OrderType = {
  id: number;
  order_number: number;
  order_date: string;
  cancelled: boolean;
};
export type ComponentType = {
  id: number;
  line_item_id: number;
  status: string;
  size: string;
};
export type LineItemType = {
  id: number;
  sku: string;
  rush: boolean;
  order_id: number;
};

export type PlanTypeQuery = Pick<
  ComponentType & LineItemType & OrderType,
  "id" | "sku" | "rush" | "size" | "order_date"
>;

export type ResponseType = {
  roll_id: number;
  length: number;
  plan: PlanType[];
};
export type PlanType = {
  id: number;
  position: number;
  size: string;
  order_date: string;
  sku: string;
  rush: boolean;
};
