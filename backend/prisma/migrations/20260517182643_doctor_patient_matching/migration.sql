-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "yearsExperience" INTEGER DEFAULT 0,
ALTER COLUMN "languages" SET DEFAULT ARRAY['en']::TEXT[];

-- AlterTable
ALTER TABLE "HealthProfile" ADD COLUMN     "chronicPain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxBudget" DOUBLE PRECISION,
ADD COLUMN     "neurologicalIssues" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postSurgery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredGender" TEXT,
ADD COLUMN     "preferredLanguage" TEXT,
ADD COLUMN     "primarySymptom" TEXT,
ADD COLUMN     "respiratoryIssues" BOOLEAN NOT NULL DEFAULT false;
