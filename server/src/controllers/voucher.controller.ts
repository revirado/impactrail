import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getStellarService } from "../services/stellar/index.js";
import { v4 as uuidv4 } from "uuid";
import type {
  ApiResponse,
  Voucher,
  CreateVoucherRequest,
} from "@impactrail/shared-types";
import { VoucherStatus } from "@impactrail/shared-types";

export async function createVoucher(
  req: Request,
  res: Response
): Promise<void> {
  const {
    ongId,
    beneficiaryId,
    amount,
    category,
    expiresAt,
  }: CreateVoucherRequest = req.body;

  if (!ongId || !beneficiaryId || !amount || !category) {
    const response: ApiResponse<null> = {
      success: false,
      error: "ongId, beneficiaryId, amount, and category are required",
    };
    res.status(400).json(response);
    return;
  }

  const qrCode = `IR-${uuidv4().slice(0, 8).toUpperCase()}`;

  const stellar = getStellarService();
  const checkpoint = await stellar.createCheckpoint({
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
  res.status(201).json(response);
}

export async function getVouchers(req: Request, res: Response): Promise<void> {
  const { ongId, beneficiaryId, status } = req.query;

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
  res.json(response);
}

export async function getVoucherById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const voucher = await prisma.voucher.findUnique({
    where: { id },
    include: {
      ong: true,
      beneficiary: true,
      transactions: true,
    },
  });

  if (!voucher) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Voucher not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Voucher> = {
    success: true,
    data: voucher as unknown as Voucher,
  };
  res.json(response);
}

export async function getVoucherByQr(
  req: Request,
  res: Response
): Promise<void> {
  const { qrCode } = req.params;

  const voucher = await prisma.voucher.findUnique({
    where: { qrCode },
    include: {
      ong: true,
      beneficiary: true,
      transactions: true,
    },
  });

  if (!voucher) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Voucher not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Voucher> = {
    success: true,
    data: voucher as unknown as Voucher,
  };
  res.json(response);
}
