import db from '../db';

export default async function getSessionAndUser(sessionToken: string) {
  const userAndSession = await db.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!userAndSession) {
    return null;
  }

  const { user, ...session } = userAndSession;
  return { user, session };
}
