import type { Collaboration } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';

import db from '../../../db';
import getCollaborationsOfUser from '../../../db/getCollaborationsOfUser';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = (await unstable_getServerSession(req, res, authOptions)) as
    | (Session & { userId: number })
    | null;

  if (!session?.userId) {
    res.status(500).json({ message: 'missing session.userId' });
    return;
  }
  const { userId } = session;

  switch (req.method) {
    case 'POST':
      await createCollaborationHandler(userId, res);
      return;
    case 'GET':
      await getCollaborationsHandler(userId, res);
      return;
    default:
      res.status(405);
      return;
  }
}

async function getCollaborationsHandler(
  userId: number,
  res: NextApiResponse<Collaboration[]>,
) {
  const collaborations = await getCollaborationsOfUser(userId);
  res.status(200).json(collaborations);
}

async function createCollaborationHandler(
  userId: number,
  res: NextApiResponse<Collaboration>,
) {
  const collaboration = await db.collaboration.create({
    data: {
      name: 'New collaboration',
      members: { create: [{ userId }] },
    },
  });

  if (!collaboration) {
    res.status(500);
    return;
  }

  res.status(200).json(collaboration);
}
