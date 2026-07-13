-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COACH', 'PLAYER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('TRAINING', 'SCRIM', 'TOURNAMENT_MATCH', 'MEETING');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "TournamentRegistrationStatus" AS ENUM ('PLANNED', 'REGISTERED', 'CONFIRMED', 'COMPLETED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "CoachAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "teamId" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiotAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "region" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "cachedCurrentRr" INTEGER,
    "cachedCurrentTier" TEXT,
    "cachedPeakRr" INTEGER,
    "cachedPeakTier" TEXT,
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiotAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EloSnapshot" (
    "id" TEXT NOT NULL,
    "riotAccountId" TEXT NOT NULL,
    "currentRr" INTEGER,
    "currentTier" TEXT,
    "peakRr" INTEGER,
    "peakTier" TEXT,
    "source" TEXT NOT NULL DEFAULT 'tracker.gg',
    "raw" JSONB,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EloSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "location" TEXT,
    "teamId" TEXT NOT NULL,
    "tournamentId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventInvite" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizer" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTournamentRegistration" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "status" "TournamentRegistrationStatus" NOT NULL DEFAULT 'PLANNED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "TeamTournamentRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamCoaches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamCoaches_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CoachAssignment_userId_teamId_key" ON "CoachAssignment"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");

-- CreateIndex
CREATE INDEX "Invite_email_idx" ON "Invite"("email");

-- CreateIndex
CREATE INDEX "Invite_status_idx" ON "Invite"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RiotAccount_userId_key" ON "RiotAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RiotAccount_gameName_tagLine_key" ON "RiotAccount"("gameName", "tagLine");

-- CreateIndex
CREATE INDEX "EloSnapshot_riotAccountId_fetchedAt_idx" ON "EloSnapshot"("riotAccountId", "fetchedAt");

-- CreateIndex
CREATE INDEX "Event_teamId_startsAt_idx" ON "Event"("teamId", "startsAt");

-- CreateIndex
CREATE INDEX "EventInvite_userId_status_idx" ON "EventInvite"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EventInvite_eventId_userId_key" ON "EventInvite"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamTournamentRegistration_teamId_tournamentId_key" ON "TeamTournamentRegistration"("teamId", "tournamentId");

-- CreateIndex
CREATE INDEX "_TeamCoaches_B_index" ON "_TeamCoaches"("B");

-- AddForeignKey
ALTER TABLE "CoachAssignment" ADD CONSTRAINT "CoachAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachAssignment" ADD CONSTRAINT "CoachAssignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiotAccount" ADD CONSTRAINT "RiotAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloSnapshot" ADD CONSTRAINT "EloSnapshot_riotAccountId_fkey" FOREIGN KEY ("riotAccountId") REFERENCES "RiotAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTournamentRegistration" ADD CONSTRAINT "TeamTournamentRegistration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTournamentRegistration" ADD CONSTRAINT "TeamTournamentRegistration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamCoaches" ADD CONSTRAINT "_TeamCoaches_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamCoaches" ADD CONSTRAINT "_TeamCoaches_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

