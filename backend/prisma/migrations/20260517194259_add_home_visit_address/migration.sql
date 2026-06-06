-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "homeAddress" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "travelFee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Center" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT;
