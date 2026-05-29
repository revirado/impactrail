import type { StellarCheckpoint } from "@impactrail/shared-types";

export interface IStellarService {
  submitOperation(data: {
    donorWallet: string;
    ongWallet: string;
    amount: number;
    operationId: string;
  }): Promise<StellarCheckpoint>;

  createCheckpoint(data: {
    operationId: string;
    type: string;
    metadata: Record<string, unknown>;
  }): Promise<StellarCheckpoint>;

  verifyTransaction(txRef: string): Promise<{
    valid: boolean;
    checkpoint?: StellarCheckpoint;
  }>;

  generateWallet(): Promise<{
    publicKey: string;
    secret: string;
  }>;
}
