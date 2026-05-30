import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stellarService } from "@/lib/stellar";

export const dynamic = "force-dynamic";
import type {
  ApiResponse,
  Operation,
  CreateOperationRequest,
  DashboardStats,
} from "@impactrail/shared-types";
import { OperationStatus } from "@impactrail/shared-types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const donorId = searchParams.get("donorId");
  const ongId = searchParams.get("ongId");
  const status = searchParams.get("status");

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

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body: CreateOperationRequest = await request.json();
  const { donorId, ongId, amount, description } = body;

  if (!donorId || !ongId || !amount) {
    const response: ApiResponse<null> = {
      success: false,
      error: "donorId, ongId, and amount are required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const donor = await prisma.user.findUnique({ where: { id: donorId } });
  const ong = await prisma.user.findUnique({ where: { id: ongId } });

  if (!donor || !ong) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Donor or ONG not found",
    };
    return NextResponse.json(response, { status: 404 });
  }

  const checkpoint = await stellarService.submitOperation({
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

  return NextResponse.json(response, { status: 201 });
}
