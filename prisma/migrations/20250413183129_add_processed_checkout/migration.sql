-- CreateTable
CREATE TABLE "ProcessedCheckout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedCheckout_sessionId_key" ON "ProcessedCheckout"("sessionId");
