/*
  Warnings:

  - You are about to drop the `UserCollaborationInvites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCollaborationInvites" DROP CONSTRAINT "UserCollaborationInvites_collaborationId_fkey";

-- DropForeignKey
ALTER TABLE "UserCollaborationInvites" DROP CONSTRAINT "UserCollaborationInvites_userId_fkey";

-- DropTable
DROP TABLE "UserCollaborationInvites";

-- CreateTable
CREATE TABLE "UserCollaborationInvite" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "collaborationId" INTEGER NOT NULL,

    CONSTRAINT "UserCollaborationInvite_pkey" PRIMARY KEY ("userId","collaborationId")
);

-- AddForeignKey
ALTER TABLE "UserCollaborationInvite" ADD CONSTRAINT "UserCollaborationInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollaborationInvite" ADD CONSTRAINT "UserCollaborationInvite_collaborationId_fkey" FOREIGN KEY ("collaborationId") REFERENCES "Collaboration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
