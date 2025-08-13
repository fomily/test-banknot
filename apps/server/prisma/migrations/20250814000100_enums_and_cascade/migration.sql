-- Create enum types
DO $$ BEGIN
  CREATE TYPE "ProductCategory" AS ENUM ('saving', 'credit');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionDirection" AS ENUM ('debit', 'credit');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionStatus" AS ENUM ('posted', 'pending', 'failed', 'canceled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionCategory" AS ENUM ('transfer', 'topup', 'taxi', 'food', 'education', 'transport', 'shopping', 'entertainment', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionSource" AS ENUM ('internal', 'admin', 'stub');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Drop FKs to re-add with CASCADE
ALTER TABLE "Wallet" DROP CONSTRAINT IF EXISTS "Wallet_userId_fkey";
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_userId_fkey";
ALTER TABLE "UserProducts" DROP CONSTRAINT IF EXISTS "UserProducts_userId_fkey";
ALTER TABLE "UserProducts" DROP CONSTRAINT IF EXISTS "UserProducts_productId_fkey";

-- Cast Product.category to enum
ALTER TABLE "Product"
  ALTER COLUMN "category" TYPE "ProductCategory" USING ("category"::"ProductCategory");

-- Cast Transaction.* to enums
-- Drop defaults that can block type casting
ALTER TABLE "Transaction" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Transaction"
  ALTER COLUMN "direction" TYPE "TransactionDirection" USING ("direction"::"TransactionDirection"),
  ALTER COLUMN "category" TYPE "TransactionCategory" USING ("category"::"TransactionCategory"),
  ALTER COLUMN "source" TYPE "TransactionSource" USING ("source"::"TransactionSource"),
  ALTER COLUMN "status" TYPE "TransactionStatus" USING ("status"::"TransactionStatus");

-- Reapply defaults for enum columns
ALTER TABLE "Transaction" ALTER COLUMN "source" SET DEFAULT 'admin'::"TransactionSource";
ALTER TABLE "Transaction" ALTER COLUMN "status" SET DEFAULT 'posted'::"TransactionStatus";

-- Re-add FKs with ON DELETE CASCADE
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserProducts" ADD CONSTRAINT "UserProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserProducts" ADD CONSTRAINT "UserProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indices and uniqueness
DO $$ BEGIN
  CREATE UNIQUE INDEX "UserProducts_userId_productId_key" ON "UserProducts" ("userId", "productId");
EXCEPTION WHEN duplicate_table THEN null; END $$;

DO $$ BEGIN
  CREATE INDEX "Transaction_userId_createdAt_idx" ON "Transaction" ("userId", "createdAt");
EXCEPTION WHEN duplicate_table THEN null; END $$;

DO $$ BEGIN
  CREATE INDEX "UserProducts_userId_status_idx" ON "UserProducts" ("userId", "status");
EXCEPTION WHEN duplicate_table THEN null; END $$;

