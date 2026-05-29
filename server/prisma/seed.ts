import { PrismaClient } from "@prisma/client";
import { UserRole, VoucherCategory, VoucherStatus, TransactionStatus, VerificationStatus, OperationStatus } from "@impactrail/shared-types";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.transaction.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.user.deleteMany();

  const corporate = await prisma.user.create({
    data: {
      name: "TechCorp SA",
      email: "admin@techcorp.com",
      role: UserRole.CORPORATE,
      walletAddress: "GMOCK_CORPORATE_WALLET_ADDRESS_1234567890",
    },
  });

  const ong = await prisma.user.create({
    data: {
      name: "Fundación Ayudar",
      email: "admin@ayudar.org",
      role: UserRole.ONG,
      walletAddress: "GMOCK_ONG_WALLET_ADDRESS_1234567890",
    },
  });

  const beneficiary1 = await prisma.user.create({
    data: {
      name: "María García",
      email: "maria@email.com",
      role: UserRole.BENEFICIARY,
    },
  });

  const beneficiary2 = await prisma.user.create({
    data: {
      name: "Juan Pérez",
      email: "juan@email.com",
      role: UserRole.BENEFICIARY,
    },
  });

  const merchant1 = await prisma.user.create({
    data: {
      name: "Almacén Don Pedro",
      email: "donpedro@comercio.com",
      role: UserRole.MERCHANT,
    },
  });

  const merchant2 = await prisma.user.create({
    data: {
      name: "Farmacia Central",
      email: "farmacia@comercio.com",
      role: UserRole.MERCHANT,
    },
  });

  console.log("Users created");

  const op1 = await prisma.operation.create({
    data: {
      donorId: corporate.id,
      ongId: ong.id,
      amount: 50000,
      status: OperationStatus.COMPLETED,
      stellarTxRef: "STELLAR-MOCK-SEED001",
      operationHash: "abc123hash_seed_operation_1",
      description: "Donación programa alimentos Q1",
    },
  });

  const op2 = await prisma.operation.create({
    data: {
      donorId: corporate.id,
      ongId: ong.id,
      amount: 25000,
      status: OperationStatus.COMPLETED,
      stellarTxRef: "STELLAR-MOCK-SEED002",
      operationHash: "abc123hash_seed_operation_2",
      description: "Donación programa útiles escolares",
    },
  });

  console.log("Operations created");

  const voucher1 = await prisma.voucher.create({
    data: {
      ongId: ong.id,
      beneficiaryId: beneficiary1.id,
      amount: 5000,
      category: VoucherCategory.FOOD,
      qrCode: "IR-SEED0001",
      status: VoucherStatus.ACTIVE,
      stellarCheckpointRef: "STELLAR-CP-SEED001",
    },
  });

  const voucher2 = await prisma.voucher.create({
    data: {
      ongId: ong.id,
      beneficiaryId: beneficiary1.id,
      amount: 3000,
      category: VoucherCategory.PHARMACY,
      qrCode: "IR-SEED0002",
      status: VoucherStatus.ACTIVE,
      stellarCheckpointRef: "STELLAR-CP-SEED002",
    },
  });

  const voucher3 = await prisma.voucher.create({
    data: {
      ongId: ong.id,
      beneficiaryId: beneficiary2.id,
      amount: 8000,
      category: VoucherCategory.SCHOOL_SUPPLIES,
      qrCode: "IR-SEED0003",
      status: VoucherStatus.USED,
      stellarCheckpointRef: "STELLAR-CP-SEED003",
    },
  });

  console.log("Vouchers created");

  await prisma.transaction.create({
    data: {
      voucherId: voucher3.id,
      merchantId: merchant1.id,
      amount: 8000,
      status: TransactionStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      stellarTxRef: "STELLAR-CP-SEED004",
      transactionHash: "tx_hash_seed_001",
    },
  });

  console.log("Transactions created");
  console.log("Seed completed!");
  console.log("\nTest accounts:");
  console.log(`  Corporate: admin@techcorp.com (${corporate.id})`);
  console.log(`  ONG: admin@ayudar.org (${ong.id})`);
  console.log(`  Beneficiary 1: maria@email.com (${beneficiary1.id})`);
  console.log(`  Beneficiary 2: juan@email.com (${beneficiary2.id})`);
  console.log(`  Merchant 1: donpedro@comercio.com (${merchant1.id})`);
  console.log(`  Merchant 2: farmacia@comercio.com (${merchant2.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
