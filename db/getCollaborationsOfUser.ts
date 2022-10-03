import type {
  Collaboration,
  UserCollaborationInvite,
  UserCollaboration,
} from '@prisma/client';
import db from '../db';

export type CollaborationsAndInvites = {
  invites: (UserCollaborationInvite & {
    collaboration: Collaboration;
  })[];
  collaborations: (UserCollaboration & {
    collaboration: Collaboration;
  })[];
};

export default async function getCollaborationsOfUser(
  userId: string,
): Promise<CollaborationsAndInvites | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      invites: {
        include: { collaboration: true },
        orderBy: { collaboration: { createdAt: 'desc' } },
      },
      collaborations: {
        include: { collaboration: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!user) {
    return null;
  }

  const { invites, collaborations } = user;
  return { invites, collaborations };
}
