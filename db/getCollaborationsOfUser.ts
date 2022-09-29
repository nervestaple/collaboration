import db from '../db';

export default function getCollaborationsOfUser(userId: number) {
  return db.collaboration.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}
