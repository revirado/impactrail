import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";
import type { IStellarService } from "./stellar.interface";
import type { StellarCheckpoint } from "@impactrail/shared-types";

export class StellarMockService implements IStellarService {
  private checkpoints: Map<string, StellarCheckpoint> = new Map();

  async submitOperation(data: {
    donorWallet: string;
    ongWallet: string;
    amount: number;
    operationId: string;
  }): Promise<StellarCheckpoint> {
    await this.simulateNetworkDelay();

    const transactionRef = `STELLAR-MOCK-${uuidv4().slice(0, 12).toUpperCase()}`;
    const operationHash = this.hashPayload({
      ...data,
      timestamp: new Date().toISOString(),
    });

    const checkpoint: StellarCheckpoint = {
      transactionRef,
      operationHash,
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      metadata: {
        type: "OPERATION_SUBMIT",
        donorWallet: data.donorWallet,
        ongWallet: data.ongWallet,
        amount: data.amount,
        operationId: data.operationId,
      },
    };

    this.checkpoints.set(transactionRef, checkpoint);
    console.log(`[Stellar Mock] Operation submitted: ${transactionRef}`);
    return checkpoint;
  }

  async createCheckpoint(data: {
    operationId: string;
    type: string;
    metadata: Record<string, unknown>;
  }): Promise<StellarCheckpoint> {
    await this.simulateNetworkDelay();

    const transactionRef = `STELLAR-CP-${uuidv4().slice(0, 12).toUpperCase()}`;
    const operationHash = this.hashPayload({
      ...data,
      timestamp: new Date().toISOString(),
    });

    const checkpoint: StellarCheckpoint = {
      transactionRef,
      operationHash,
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      metadata: {
        type: data.type,
        operationId: data.operationId,
        ...data.metadata,
      },
    };

    this.checkpoints.set(transactionRef, checkpoint);
    console.log(`[Stellar Mock] Checkpoint created: ${transactionRef}`);
    return checkpoint;
  }

  async verifyTransaction(txRef: string): Promise<{
    valid: boolean;
    checkpoint?: StellarCheckpoint;
  }> {
    await this.simulateNetworkDelay();

    const checkpoint = this.checkpoints.get(txRef);
    if (!checkpoint) {
      return { valid: false };
    }

    return { valid: true, checkpoint };
  }

  async generateWallet(): Promise<{
    publicKey: string;
    secret: string;
  }> {
    const publicKey = `G${this.randomAlphanumeric(55).toUpperCase()}`;
    const secret = `S${this.randomAlphanumeric(55).toUpperCase()}`;
    return { publicKey, secret };
  }

  private hashPayload(data: Record<string, unknown>): string {
    const payload = JSON.stringify(data, Object.keys(data).sort());
    return createHash("sha256").update(payload).digest("hex");
  }

  private randomAlphanumeric(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 200) + 50;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export const stellarService = new StellarMockService();
