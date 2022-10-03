import cookie from 'cookie';
import getSessionAndUser from '../db/getSessionAndUser';

const cookiePrefix = location.protocol.startsWith('https:') ? '__Secure-' : '';
const tokenCookieKey = `${cookiePrefix}next-auth.session-token`;

export default async function getUserIdFromCookieString(cookieString?: string) {
  if (!cookieString) {
    return null;
  }

  const cookies = cookie.parse(cookieString);
  const sessionToken = cookies[tokenCookieKey];
  if (!sessionToken) {
    return null;
  }

  const sessionAndUser = await getSessionAndUser(sessionToken);
  if (!sessionAndUser) {
    return null;
  }

  return sessionAndUser.user.id;
}
