import type { Collaboration } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import db from '../../../db';
import getCollaborationsOfUser, {
  type CollaborationsAndInvites,
} from '../../../db/getCollaborationsOfUser';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const userId = session?.user?.id;
  if (!userId) {
    console.error(session);
    res.status(500).json({ error: 'missing userId' });
    return;
  }

  switch (req.method) {
    case 'POST':
      await createCollaborationHandler(userId, res);
      return;
    case 'GET':
      await getCollaborationsHandler(userId, res);
      return;
    default:
      res.status(405).end();
      return;
  }
}

async function getCollaborationsHandler(
  userId: string,
  res: NextApiResponse<CollaborationsAndInvites>,
) {
  const collaborationsAndInvites = await getCollaborationsOfUser(userId);
  if (!collaborationsAndInvites) {
    res.status(500).end();
    return;
  }

  res.status(200).json(collaborationsAndInvites);
}

async function createCollaborationHandler(
  userId: string,
  res: NextApiResponse<Collaboration>,
) {
  const collaboration = await db.collaboration.create({
    data: {
      name: 'New collaboration',
      members: { create: [{ userId }] },
    },
  });

  if (!collaboration) {
    res.status(500).end();
    return;
  }

  res.status(200).json(collaboration);
}
