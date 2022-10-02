/*
  Warnings:

  - You are about to drop the `UserCollaborations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCollaborations" DROP CONSTRAINT "UserCollaborations_collaborationId_fkey";

-- DropForeignKey
ALTER TABLE "UserCollaborations" DROP CONSTRAINT "UserCollaborations_userId_fkey";

-- DropTable
DROP TABLE "UserCollaborations";

-- CreateTable
CREATE TABLE "UserCollaboration" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "collaborationId" INTEGER NOT NULL,

    CONSTRAINT "UserCollaboration_pkey" PRIMARY KEY ("userId","collaborationId")
);

-- AddForeignKey
ALTER TABLE "UserCollaboration" ADD CONSTRAINT "UserCollaboration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollaboration" ADD CONSTRAINT "UserCollaboration_collaborationId_fkey" FOREIGN KEY ("collaborationId") REFERENCES "Collaboration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
