import { Pool } from "pg";
// import { ComponentType, PlanTypeQuery, OrderType } from "./types";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

export const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: Number(DB_PORT),
});

/* DB Table Interfaces */

// export class Order {
//   static getNonCancelledOrder() {
//     return new Promise<OrderType[]>((res, rej) => {
//       pool.query('SELECT * FROM "order" WHERE cancelled = false').then(
//         (orders) => {
//           res(orders.rows);
//         },
//         (error) => {
//           console.log(error);
//         }
//       );
//     });
//   }
// }

// export class LineItem {
//   static getLineItemMergeComponent() {
//     const query =
//       "SELECT line_item.sku, line_item.rush, component.id, component.size, " +
//       '"order".order_date FROM line_item, component, "order" WHERE component.line_item_id = line_item.id AND line_item.order_id = "order".id AND component.status=' +
//       "'Pending' AND " +
//       '"order".cancelled = false ORDER BY "order".order_date';
//     return new Promise<PlanTypeQuery[]>((res, rej) => {
//       pool.query(query).then(
//         (listItem) => {
//           res(listItem.rows);
//         },
//         (error) => {
//           console.log(error);
//           rej(error?.message ?? "Reject on query");
//         }
//       );
//     });
//   }
// }

// export class Component {
//   static getPendingComponent() {
//     return new Promise<ComponentType[]>((res, rej) => {
//       pool.query("SELECT * FROM component WHERE status='Pending'").then(
//         (component) => {
//           res(component.rows);
//         },
//         (error) => {
//           console.log(error);
//         }
//       );
//     });
//   }
// }
