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
  isInvite: boolean;
};

export default async function getCollaborationById(
  userId: number,
  collaborationId: number,
) {
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
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      members: { include: { user: { select: { id: true, name: true } } } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return collaboration;
}
