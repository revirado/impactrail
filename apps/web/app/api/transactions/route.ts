import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stellarService } from "@/lib/stellar";

export const dynamic = "force-dynamic";
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get("merchantId");
  const voucherId = searchParams.get("voucherId");
  const status = searchParams.get("status");

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

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body: ProcessTransactionRequest = await request.json();
  const { voucherId, merchantId } = body;

  if (!voucherId || !merchantId) {
    const response: ApiResponse<null> = {
      success: false,
      error: "voucherId and merchantId are required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const voucher = await prisma.voucher.findUnique({
    where: { id: voucherId },
  });

  if (!voucher) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Voucher not found",
    };
    return NextResponse.json(response, { status: 404 });
  }

  if (voucher.status !== VoucherStatus.ACTIVE) {
    const response: ApiResponse<null> = {
      success: false,
      error: `Voucher is not active (status: ${voucher.status})`,
    };
    return NextResponse.json(response, { status: 400 });
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
    return NextResponse.json(response, { status: 400 });
  }

  const checkpoint = await stellarService.createCheckpoint({
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

  return NextResponse.json(response, { status: 201 });
}
