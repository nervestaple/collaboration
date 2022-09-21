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
  if (req.method !== 'POST') {
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

  const collaboration = await db.collaboration.create({
    data: {
      name: 'New collaboration',
      members: { create: [{ userId: session.userId }] },
    },
  });

  res.status(200).json({ collaboration });
}
