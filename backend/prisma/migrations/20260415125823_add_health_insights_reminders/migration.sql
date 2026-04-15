-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('SESSION', 'EXERCISE', 'MEDICATION');

-- CreateTable
CREATE TABLE "HealthInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "heartRate" INTEGER,
    "dailySteps" INTEGER,
    "exerciseSessions" INTEGER NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "painLevel" DOUBLE PRECISION,
    "sleepQuality" DOUBLE PRECISION,
    "week" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL DEFAULT 'SESSION',
    "time" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HealthInsight" ADD CONSTRAINT "HealthInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
