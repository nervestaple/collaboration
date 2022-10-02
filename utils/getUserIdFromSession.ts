import { isFinite, isUndefined } from 'lodash-es';
import type { GetServerSidePropsContext } from 'next';
import { type Session, unstable_getServerSession } from 'next-auth';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export default async function getUserIdFromSession(
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res'],
) {
  const session = (await unstable_getServerSession(req, res, authOptions)) as
    | (Session & { userId: number })
    | null;
  console.log(session);
  if (!session || isUndefined(session?.userId) || !isFinite(session?.userId)) {
    return null;
  }

  return session.userId;
}
