-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "repair_requests" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "repair_requests_userId_idx" ON "repair_requests"("userId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_requests" ADD CONSTRAINT "repair_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
