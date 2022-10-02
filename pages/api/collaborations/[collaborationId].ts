import type { Collaboration, UserCollaboration } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';

import db from '../../../db';
import getCollaborationById from '../../../db/getCollaborationById';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Collaboration | UserCollaboration | { error: string }>,
) {
  const session = (await unstable_getServerSession(req, res, authOptions)) as
    | (Session & { userId: number })
    | null;

  if (!session?.userId) {
    res.status(500).json({ error: 'Not logged in or no session found.' });
    return;
  }
  const userId = session.userId;

  if (Array.isArray(req.query.collaborationId)) {
    res.status(404).json({ error: 'Malformed collaborationId.' });
    return;
  }

  const collaborationId = parseInt(req.query.collaborationId || '');
  if (!isFinite(collaborationId)) {
    res.status(404).json({ error: 'Malformed collaborationId.' });
    return;
  }

  switch (req.method) {
    case 'PATCH':
      await updateCollaborationHandler(userId, collaborationId, req, res);
      return;
    case 'GET':
      await getCollaborationHandler(userId, collaborationId, res);
      return;
    case 'DELETE':
      await leaveCollaborationHandler(userId, collaborationId, res);
      return;
    default:
      res.status(405).end();
      return;
  }
}

async function getCollaborationHandler(
  userId: number,
  id: number,
  res: NextApiResponse<Collaboration | { error: string }>,
) {
  const collaboration = await getCollaborationById(userId, id);
  if (!collaboration) {
    res.status(500).json({ error: 'Collaboration not found.' });
    return;
  }

  res.status(200).json(collaboration);
}

async function updateCollaborationHandler(
  userId: number,
  id: number,
  req: NextApiRequest,
  res: NextApiResponse<Collaboration | { error: string }>,
) {
  const { count } = await db.collaboration.updateMany({
    where: { id, members: { some: { userId } } },
    data: { name: req.body.name },
  });

  const collaboration = await db.collaboration.findUnique({ where: { id } });

  if (count === 0 || !collaboration) {
    res.status(404).json({ error: 'No collaboration found to update.' });
    return;
  }

  res.status(200).json(collaboration);
}

async function leaveCollaborationHandler(
  userId: number,
  collaborationId: number,
  res: NextApiResponse<UserCollaboration | { error: string }>,
) {
  const userCollaboration = await db.userCollaboration.delete({
    where: {
      userId_collaborationId: {
        userId,
        collaborationId,
      },
    },
  });

  if (!userCollaboration) {
    res.status(500).json({ error: 'Collaboration membership not deleted.' });
    return;
  }

  res.status(200).json(userCollaboration);
}
