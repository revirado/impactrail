import { Router } from "express";
import {
  createOperation,
  getOperations,
  getOperationById,
  getDashboardStats,
} from "../controllers/operation.controller.js";

const router = Router();

router.get("/stats", getDashboardStats);
router.get("/", getOperations);
router.get("/:id", getOperationById);
router.post("/", createOperation);

export default router;
