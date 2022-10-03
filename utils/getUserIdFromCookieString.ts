import cookie from 'cookie';
import getSessionAndUser from '../db/getSessionAndUser';

export default async function getUserIdFromCookieString(cookieString?: string) {
  if (!cookieString) {
    return null;
  }

  const cookies = cookie.parse(cookieString);
  const sessionToken = cookies['next-auth.session-token'];
  if (!sessionToken) {
    return null;
  }

  const sessionAndUser = await getSessionAndUser(sessionToken);
  if (!sessionAndUser) {
    return null;
  }

  return sessionAndUser.user.id;
}
