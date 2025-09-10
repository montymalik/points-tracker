-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'AUTO_DEPOSIT');

-- CreateTable
CREATE TABLE "Balance" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "videoGames" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "generalSpending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "charity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "videoGames" DOUBLE PRECISION,
    "generalSpending" DOUBLE PRECISION,
    "charity" DOUBLE PRECISION,
    "savings" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- Add to prisma/migrations/[timestamp]_add_points_system/migration.sql

-- CreateTable for Tasks
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Daily Task Completions
CREATE TABLE "DailyTaskCompletion" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "completedDate" DATE NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Rewards
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "pointsCost" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Reward Redemptions
CREATE TABLE "RewardRedemption" (
    "id" SERIAL NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "pointsSpent" INTEGER NOT NULL,
    "redeemedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Points Balance
CREATE TABLE "PointsBalance" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointsBalance_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "DailyTaskCompletion" ADD CONSTRAINT "DailyTaskCompletion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RewardRedemption" ADD CONSTRAINT "RewardRedemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraint to prevent duplicate task completions on same day
ALTER TABLE "DailyTaskCompletion" ADD CONSTRAINT "DailyTaskCompletion_taskId_completedDate_key" UNIQUE ("taskId", "completedDate");

-- Insert initial points balance record
INSERT INTO "PointsBalance" ("id", "totalPoints", "updatedAt") VALUES (1, 0, CURRENT_TIMESTAMP);

-- Insert some example tasks
INSERT INTO "Task" ("name", "description", "points") VALUES 
    ('Breathing Exercise', 'Complete 10 minutes of breathing exercises', 10),
    ('Reading', 'Read for 30 minutes', 15),
    ('Exercise', 'Complete workout routine', 20),
    ('Chores', 'Complete assigned household chores', 25);

-- Insert some example rewards
INSERT INTO "Reward" ("name", "description", "pointsCost") VALUES 
    ('Extra Screen Time', '30 minutes of extra screen time', 50),
    ('Special Treat', 'Choose a special snack or treat', 75),
    ('Small Toy', 'Pick a small toy under $10', 100),
    ('Movie Night', 'Choose the family movie for movie night', 125);
