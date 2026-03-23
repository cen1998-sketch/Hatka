-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "checkIn" TEXT DEFAULT '14:00',
ADD COLUMN     "checkOut" TEXT DEFAULT '12:00',
ADD COLUMN     "roomCount" INTEGER DEFAULT 1,
ADD COLUMN     "yearBuilt" INTEGER;

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "title" TEXT,
    "type" TEXT,
    "area" DOUBLE PRECISION,
    "capacityAdults" INTEGER NOT NULL DEFAULT 1,
    "capacityChildren" INTEGER NOT NULL DEFAULT 0,
    "beds" JSONB,
    "amenities" JSONB,
    "pricePerDay" DOUBLE PRECISION,
    "priceLongTerm" DOUBLE PRECISION,
    "instantBooking" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Room_listingId_idx" ON "Room"("listingId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
