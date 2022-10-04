import type {
  Collaboration,
  Message,
  User,
  UserCollaborationInvite,
  UserCollaboration,
} from '@prisma/client';

import db from '../db';

export type CollaborationExtended = Collaboration & {
  messages: Message[];
  members: (UserCollaboration & {
    user: User;
  })[];
  invites: (UserCollaborationInvite & { user: User })[];
};

export default async function getCollaborationById(
  userId: string,
  collaborationId: number,
): Promise<CollaborationExtended | null> {
  const collaboration = await db.collaboration.findFirst({
    where: {
      id: collaborationId,
      OR: [
        { members: { some: { userId } } },
        { invites: { some: { userId } } },
      ],
    },
    include: {
      invites: {
        include: {
          user: true,
        },
      },
      members: {
        include: { user: true },
      },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return collaboration;
}
