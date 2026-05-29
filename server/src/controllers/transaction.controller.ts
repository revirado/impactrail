import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getStellarService } from "../services/stellar/index.js";
import type {
  ApiResponse,
  Transaction,
  ProcessTransactionRequest,
} from "@impactrail/shared-types";
import {
  TransactionStatus,
  VerificationStatus,
  VoucherStatus,
} from "@impactrail/shared-types";

export async function processTransaction(
  req: Request,
  res: Response
): Promise<void> {
  const { voucherId, merchantId }: ProcessTransactionRequest = req.body;

  if (!voucherId || !merchantId) {
    const response: ApiResponse<null> = {
      success: false,
      error: "voucherId and merchantId are required",
    };
    res.status(400).json(response);
    return;
  }

  const voucher = await prisma.voucher.findUnique({
    where: { id: voucherId },
  });

  if (!voucher) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Voucher not found",
    };
    res.status(404).json(response);
    return;
  }

  if (voucher.status !== VoucherStatus.ACTIVE) {
    const response: ApiResponse<null> = {
      success: false,
      error: `Voucher is not active (status: ${voucher.status})`,
    };
    res.status(400).json(response);
    return;
  }

  if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
    await prisma.voucher.update({
      where: { id: voucherId },
      data: { status: VoucherStatus.EXPIRED },
    });
    const response: ApiResponse<null> = {
      success: false,
      error: "Voucher has expired",
    };
    res.status(400).json(response);
    return;
  }

  const stellar = getStellarService();
  const checkpoint = await stellar.createCheckpoint({
    operationId: voucherId,
    type: "TRANSACTION_PROCESSED",
    metadata: { voucherId, merchantId, amount: voucher.amount },
  });

  const transaction = await prisma.transaction.create({
    data: {
      voucherId,
      merchantId,
      amount: voucher.amount,
      status: TransactionStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      stellarTxRef: checkpoint.transactionRef,
      transactionHash: checkpoint.operationHash,
    },
    include: {
      voucher: { include: { beneficiary: true, ong: true } },
      merchant: true,
    },
  });

  await prisma.voucher.update({
    where: { id: voucherId },
    data: { status: VoucherStatus.USED },
  });

  const response: ApiResponse<Transaction> = {
    success: true,
    data: transaction as unknown as Transaction,
    message: "Transaction processed successfully",
  };
  res.status(201).json(response);
}

export async function getTransactions(
  req: Request,
  res: Response
): Promise<void> {
  const { merchantId, voucherId, status } = req.query;

  const where: Record<string, unknown> = {};
  if (merchantId) where.merchantId = merchantId;
  if (voucherId) where.voucherId = voucherId;
  if (status) where.status = status;

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      voucher: { include: { beneficiary: true, ong: true } },
      merchant: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const response: ApiResponse<Transaction[]> = {
    success: true,
    data: transactions as unknown as Transaction[],
  };
  res.json(response);
}

export async function getTransactionById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      voucher: { include: { beneficiary: true, ong: true } },
      merchant: true,
    },
  });

  if (!transaction) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Transaction not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Transaction> = {
    success: true,
    data: transaction as unknown as Transaction,
  };
  res.json(response);
}

export async function verifyTransactionOnChain(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction || !transaction.stellarTxRef) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Transaction not found or has no Stellar reference",
    };
    res.status(404).json(response);
    return;
  }

  const stellar = getStellarService();
  const result = await stellar.verifyTransaction(transaction.stellarTxRef);

  const response: ApiResponse<{
    valid: boolean;
    checkpoint?: unknown;
  }> = {
    success: true,
    data: result,
  };
  res.json(response);
}
