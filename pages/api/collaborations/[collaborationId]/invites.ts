import type {
  PrismaPromise,
  UserCollaboration,
  UserCollaborationInvite,
} from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import isValidEmail from 'is-valid-email';
import { isBoolean } from 'lodash-es';

import db from '../../../../db';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserCollaborationInvite | { error: string }>,
) {
  const session = (await unstable_getServerSession(req, res, authOptions)) as
    | (Session & { userId: number })
    | null;

  if (!session) {
    res.status(401).json({ error: 'No session -- not logged in?' });
    return;
  }

  if (Array.isArray(req.query.collaborationId)) {
    res.status(404).json({
      error: `Improper collaboration ID parameter: ${req.query.collaborationId}`,
    });
    return;
  }

  const collaborationId = parseInt(req.query.collaborationId || '');
  if (!isFinite(collaborationId)) {
    res
      .status(404)
      .json({ error: `No collaboration found with ID: ${collaborationId}.` });
    return;
  }

  switch (req.method) {
    case 'POST':
      await inviteToCollaborationHandler(session, collaborationId, req, res);
      return;
    case 'PATCH':
      await respondToCollaborationInviteHandler(
        session,
        collaborationId,
        req,
        res,
      );
      return;
    default:
      res.status(405).end();
      return;
  }
}

async function inviteToCollaborationHandler(
  session: Session & { userId: number },
  collaborationId: number,
  req: NextApiRequest,
  res: NextApiResponse<UserCollaborationInvite | { error: string }>,
) {
  const userId = session.userId;

  if (!isValidEmail(req.body.email) || req.body.email.length === '') {
    res.status(400).json({ error: `Invalid email: ${req.body.email}.` });
    return;
  }

  const { email } = req.body;
  if (email === session.user?.email) {
    res.status(400).json({ error: 'You can not invite yourself.' });
    return;
  }

  const matchingUserCollaboration = await db.userCollaboration.findUnique({
    where: { userId_collaborationId: { userId, collaborationId } },
  });
  if (!matchingUserCollaboration) {
    res.status(401).json({
      error: `User ${userId} doesn't belong to collaboration: ${collaborationId}.`,
    });
    return;
  }

  const invitedUser = await db.user.findFirst({ where: { email } });
  if (!invitedUser) {
    res.status(404).json({ error: `No user matching: ${email}.` });
    return;
  }

  const matchingInvitedUserCollaboration =
    await db.userCollaboration.findUnique({
      where: {
        userId_collaborationId: { userId: invitedUser.id, collaborationId },
      },
    });
  if (matchingInvitedUserCollaboration) {
    res.status(200).end();
    return;
  }

  const invite = await db.userCollaborationInvite.create({
    data: {
      collaboration: { connect: { id: collaborationId } },
      user: { connect: { email } },
    },
  });

  res.status(200).json(invite);
}

async function respondToCollaborationInviteHandler(
  { userId }: Session & { userId: number },
  collaborationId: number,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isBoolean(req.body.inviteAccepted)) {
    res
      .status(400)
      .json({ error: `Missing boolean 'inviteAccepted' from body.` });
    return;
  }

  const { inviteAccepted } = req.body;

  const queries: PrismaPromise<UserCollaborationInvite | UserCollaboration>[] =
    [
      db.userCollaborationInvite.delete({
        where: {
          userId_collaborationId: {
            userId,
            collaborationId,
          },
        },
      }),
    ];

  if (inviteAccepted) {
    queries.push(
      db.userCollaboration.create({
        data: {
          userId,
          collaborationId,
        },
      }),
    );
  }

  const result = await db.$transaction(queries);
  res.status(200).json(result);
}
