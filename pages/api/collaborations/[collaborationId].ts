import type { Collaboration } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';

import db from '../../../db';
import getCollaborationById from '../../../db/getCollaborationById';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Collaboration>,
) {
  const session = (await unstable_getServerSession(req, res, authOptions)) as
    | (Session & { userId: number })
    | null;

  if (!session?.userId) {
    res.status(500);
    return;
  }
  const userId = session.userId;

  if (Array.isArray(req.query.collaborationId)) {
    res.status(404);
    return;
  }

  const collaborationId = parseInt(req.query.collaborationId || '');
  if (!isFinite(collaborationId)) {
    res.status(404);
    return;
  }

  const matchingUserCollaboration = await db.userCollaborations.findUnique({
    where: { userId_collaborationId: { userId, collaborationId } },
  });
  if (!matchingUserCollaboration) {
    res.status(401);
    return;
  }

  switch (req.method) {
    case 'PATCH':
      await updateCollaborationHandler(collaborationId, req, res);
      return;
    case 'GET':
      await getCollaborationHandler(userId, collaborationId, res);
      return;
    default:
      res.status(405);
      return;
  }
}

async function getCollaborationHandler(
  userId: number,
  id: number,
  res: NextApiResponse<Collaboration>,
) {
  const collaboration = await getCollaborationById(userId, id);
  if (!collaboration) {
    res.status(500);
    return;
  }

  res.status(200).json(collaboration);
}

async function updateCollaborationHandler(
  id: number,
  req: NextApiRequest,
  res: NextApiResponse<Collaboration>,
) {
  const collaboration = await db.collaboration.update({
    where: { id },
    data: { name: req.body.name },
  });

  if (!collaboration) {
    res.status(404);
    return;
  }

  res.status(200).json(collaboration);
}
