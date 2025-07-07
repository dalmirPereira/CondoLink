-- CreateTable
CREATE TABLE "Maintenance" (
    "id" SERIAL NOT NULL,
    "task" VARCHAR(50) NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    "subcontractor" INTEGER,
    "category" INTEGER NOT NULL,
    "status" VARCHAR(50),
    "comment" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueTo" TIMESTAMP(3),

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Maintenance_buildingId_idx" ON "Maintenance"("buildingId");

-- CreateIndex
CREATE INDEX "Maintenance_blockId_idx" ON "Maintenance"("blockId");

-- CreateIndex
CREATE INDEX "Maintenance_subcontractor_idx" ON "Maintenance"("subcontractor");

-- CreateIndex
CREATE INDEX "Maintenance_category_idx" ON "Maintenance"("category");

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_subcontractor_fkey" FOREIGN KEY ("subcontractor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_category_fkey" FOREIGN KEY ("category") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
