import type {
  Collaboration,
  User,
  UserCollaborationInvites,
  UserCollaborations,
} from '@prisma/client';

import db from '.';

export type UserWithCollaborations = User & {
  collaborations: (UserCollaborations & {
    user: User;
    collaboration: Collaboration;
  })[];
  invites: UserCollaborationInvites[];
};

export default async function getUserWithCollaborations(
  email?: string | null,
): Promise<UserWithCollaborations | null> {
  if (!email) {
    return null;
  }

  return await db.user.findUnique({
    where: { email },
    include: {
      collaborations: { include: { collaboration: true, user: true } },
      invites: true,
    },
  });
}
