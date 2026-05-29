import { Router } from "express";
import {
  createVoucher,
  getVouchers,
  getVoucherById,
  getVoucherByQr,
} from "../controllers/voucher.controller.js";

const router = Router();

router.get("/", getVouchers);
router.get("/qr/:qrCode", getVoucherByQr);
router.get("/:id", getVoucherById);
router.post("/", createVoucher);

export default router;
