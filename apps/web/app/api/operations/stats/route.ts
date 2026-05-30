import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, DashboardStats } from "@impactrail/shared-types";
import { OperationStatus } from "@impactrail/shared-types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const donorId = searchParams.get("donorId");

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

  return NextResponse.json(response);
}
