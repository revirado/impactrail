import type { IStellarService } from "./stellar.interface.js";
import { StellarMockService } from "./stellar.mock.js";

let stellarService: IStellarService;

export function getStellarService(): IStellarService {
  if (!stellarService) {
    stellarService = new StellarMockService();
  }
  return stellarService;
}

export function setStellarService(service: IStellarService): void {
  stellarService = service;
}
