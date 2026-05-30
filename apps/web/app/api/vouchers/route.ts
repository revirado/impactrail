import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stellarService } from "@/lib/stellar";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
import type {
  ApiResponse,
  Voucher,
  CreateVoucherRequest,
} from "@impactrail/shared-types";
import { VoucherStatus } from "@impactrail/shared-types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ongId = searchParams.get("ongId");
  const beneficiaryId = searchParams.get("beneficiaryId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (ongId) where.ongId = ongId;
  if (beneficiaryId) where.beneficiaryId = beneficiaryId;
  if (status) where.status = status;

  const vouchers = await prisma.voucher.findMany({
    where,
    include: {
      ong: true,
      beneficiary: true,
      transactions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const response: ApiResponse<Voucher[]> = {
    success: true,
    data: vouchers as unknown as Voucher[],
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body: CreateVoucherRequest = await request.json();
  const { ongId, beneficiaryId, amount, category, expiresAt } = body;

  if (!ongId || !beneficiaryId || !amount || !category) {
    const response: ApiResponse<null> = {
      success: false,
      error: "ongId, beneficiaryId, amount, and category are required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const qrCode = `IR-${uuidv4().slice(0, 8).toUpperCase()}`;

  const checkpoint = await stellarService.createCheckpoint({
    operationId: qrCode,
    type: "VOUCHER_CREATED",
    metadata: { ongId, beneficiaryId, amount, category },
  });

  const voucher = await prisma.voucher.create({
    data: {
      ongId,
      beneficiaryId,
      amount,
      category,
      qrCode,
      status: VoucherStatus.ACTIVE,
      stellarCheckpointRef: checkpoint.transactionRef,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    include: {
      ong: true,
      beneficiary: true,
    },
  });

  const response: ApiResponse<Voucher> = {
    success: true,
    data: voucher as unknown as Voucher,
    message: "Voucher created successfully",
  };

  return NextResponse.json(response, { status: 201 });
}
