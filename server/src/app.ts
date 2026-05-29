import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import operationRoutes from "./routes/operation.routes.js";
import voucherRoutes from "./routes/voucher.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
