-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "bookingState" TEXT NOT NULL DEFAULT 'IDLE',
ADD COLUMN     "pendingDay" TEXT,
ADD COLUMN     "pendingDoctorId" TEXT,
ADD COLUMN     "pendingSlotId" TEXT;
