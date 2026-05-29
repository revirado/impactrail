import { Router } from "express";
import {
  processTransaction,
  getTransactions,
  getTransactionById,
  verifyTransactionOnChain,
} from "../controllers/transaction.controller.js";

const router = Router();

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.get("/:id/verify", verifyTransactionOnChain);
router.post("/", processTransaction);

export default router;
