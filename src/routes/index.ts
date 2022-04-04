import express from "express";
import getRollPlanRoutes from "./roll-plans";

function getRouter() {
  const router = express.Router();
  router.use("/roll", getRollPlanRoutes());
  return router;
}

export default getRouter;
