import db from '../db';

export default async function getCollaborationsOfUser(userId: number) {
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
