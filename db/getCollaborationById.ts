import type {
  Collaboration,
  Message,
  User,
  UserCollaborations,
} from '@prisma/client';

import db from '../db';

export type CollaborationExtended = Collaboration & {
  messages: Message[];
  members: (UserCollaborations & {
    user: User;
  })[];
};

export default async function getCollaborationById(
  userId: number,
  collaborationId: number,
) {
  const collaboration = await db.collaboration.findFirst({
    where: { id: collaborationId, members: { some: { userId } } },
    include: {
      members: { include: { user: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  return collaboration;
}
