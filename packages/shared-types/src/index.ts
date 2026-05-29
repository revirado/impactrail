export enum UserRole {
  CORPORATE = "CORPORATE",
  ONG = "ONG",
  BENEFICIARY = "BENEFICIARY",
  MERCHANT = "MERCHANT",
}

export enum OperationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum VoucherStatus {
  ACTIVE = "ACTIVE",
  USED = "USED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export enum VoucherCategory {
  FOOD = "FOOD",
  PHARMACY = "PHARMACY",
  SCHOOL_SUPPLIES = "SCHOOL_SUPPLIES",
  CLOTHING = "CLOTHING",
  GENERAL = "GENERAL",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
}

export enum VerificationStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  FLAGGED = "FLAGGED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Operation {
  id: string;
  donorId: string;
  ongId: string;
  amount: number;
  status: OperationStatus;
  stellarTxRef?: string;
  operationHash?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Voucher {
  id: string;
  ongId: string;
  beneficiaryId: string;
  amount: number;
  category: VoucherCategory;
  qrCode: string;
  status: VoucherStatus;
  stellarCheckpointRef?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  voucherId: string;
  merchantId: string;
  amount: number;
  status: TransactionStatus;
  verificationStatus: VerificationStatus;
  stellarTxRef?: string;
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StellarCheckpoint {
  transactionRef: string;
  operationHash: string;
  timestamp: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface CreateOperationRequest {
  donorId: string;
  ongId: string;
  amount: number;
  description?: string;
}

export interface CreateVoucherRequest {
  ongId: string;
  beneficiaryId: string;
  amount: number;
  category: VoucherCategory;
  expiresAt?: string;
}

export interface ProcessTransactionRequest {
  voucherId: string;
  merchantId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalOperations: number;
  totalAmountDistributed: number;
  activeVouchers: number;
  usedVouchers: number;
  totalTransactions: number;
  verifiedTransactions: number;
}
