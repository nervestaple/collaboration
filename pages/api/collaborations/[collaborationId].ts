import type { Collaboration } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';

import db from '../../../db';
import { authOptions } from '../auth/[...nextauth]';

interface Return {
  message?: string;
  collaboration?: Collaboration;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Return>,
) {
  if (req.method !== 'PATCH') {
    res.status(404);
    return;
  }

  const session = (await unstable_getServerSession(
    req,
    res,
    authOptions,
  )) as Session & { userId: number };

  if (!session.userId) {
    res.status(500).json({ message: 'missing session.userId' });
    return;
  }

  if (Array.isArray(req.query.collaborationId)) {
    res.status(404);
    return;
  }

  const id = parseInt(req.query.collaborationId || '');
  if (!isFinite(id)) {
    res.status(404);
    return;
  }

  const collaboration = await db.collaboration.update({
    where: { id },
    data: { name: req.body.name },
  });
  if (!collaboration) {
    res.status(404);
    return;
  }

  res.status(200).json({ collaboration });
}
