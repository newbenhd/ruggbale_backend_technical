import express from "express";
import * as rollPlansController from "./roll-plans-controller";

function getRollPlansRoutes() {
  const router = express.Router();

  router.get("/next", rollPlansController.getNextRollPlans);

  return router;
}

export default getRollPlansRoutes;
