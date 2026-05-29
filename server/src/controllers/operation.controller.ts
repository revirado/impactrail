import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getStellarService } from "../services/stellar/index.js";
import type {
  ApiResponse,
  Operation,
  CreateOperationRequest,
  DashboardStats,
} from "@impactrail/shared-types";
import { OperationStatus } from "@impactrail/shared-types";

export async function createOperation(
  req: Request,
  res: Response
): Promise<void> {
  const { donorId, ongId, amount, description }: CreateOperationRequest =
    req.body;

  if (!donorId || !ongId || !amount) {
    const response: ApiResponse<null> = {
      success: false,
      error: "donorId, ongId, and amount are required",
    };
    res.status(400).json(response);
    return;
  }

  const donor = await prisma.user.findUnique({ where: { id: donorId } });
  const ong = await prisma.user.findUnique({ where: { id: ongId } });

  if (!donor || !ong) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Donor or ONG not found",
    };
    res.status(404).json(response);
    return;
  }

  const stellar = getStellarService();
  const checkpoint = await stellar.submitOperation({
    donorWallet: donor.walletAddress || "MOCK_WALLET",
    ongWallet: ong.walletAddress || "MOCK_WALLET",
    amount,
    operationId: "",
  });

  const operation = await prisma.operation.create({
    data: {
      donorId,
      ongId,
      amount,
      description,
      status: OperationStatus.COMPLETED,
      stellarTxRef: checkpoint.transactionRef,
      operationHash: checkpoint.operationHash,
    },
    include: {
      donor: true,
      ong: true,
    },
  });

  const response: ApiResponse<Operation> = {
    success: true,
    data: operation as unknown as Operation,
    message: "Operation created successfully",
  };
  res.status(201).json(response);
}

export async function getOperations(
  req: Request,
  res: Response
): Promise<void> {
  const { donorId, ongId, status } = req.query;

  const where: Record<string, unknown> = {};
  if (donorId) where.donorId = donorId;
  if (ongId) where.ongId = ongId;
  if (status) where.status = status;

  const operations = await prisma.operation.findMany({
    where,
    include: {
      donor: true,
      ong: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const response: ApiResponse<Operation[]> = {
    success: true,
    data: operations as unknown as Operation[],
  };
  res.json(response);
}

export async function getOperationById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const operation = await prisma.operation.findUnique({
    where: { id },
    include: {
      donor: true,
      ong: true,
    },
  });

  if (!operation) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Operation not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Operation> = {
    success: true,
    data: operation as unknown as Operation,
  };
  res.json(response);
}

export async function getDashboardStats(
  req: Request,
  res: Response
): Promise<void> {
  const { donorId } = req.query;

  const operationWhere = donorId ? { donorId: donorId as string } : {};

  const [
    totalOperations,
    amountResult,
    activeVouchers,
    usedVouchers,
    totalTransactions,
    verifiedTransactions,
  ] = await Promise.all([
    prisma.operation.count({ where: operationWhere }),
    prisma.operation.aggregate({
      where: { ...operationWhere, status: OperationStatus.COMPLETED },
      _sum: { amount: true },
    }),
    prisma.voucher.count({ where: { status: "ACTIVE" } }),
    prisma.voucher.count({ where: { status: "USED" } }),
    prisma.transaction.count(),
    prisma.transaction.count({ where: { verificationStatus: "VERIFIED" } }),
  ]);

  const stats: DashboardStats = {
    totalOperations,
    totalAmountDistributed: amountResult._sum.amount || 0,
    activeVouchers,
    usedVouchers,
    totalTransactions,
    verifiedTransactions,
  };

  const response: ApiResponse<DashboardStats> = {
    success: true,
    data: stats,
  };
  res.json(response);
}
