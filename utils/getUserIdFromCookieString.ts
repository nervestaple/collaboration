import cookie from 'cookie';
import getSessionAndUser from '../db/getSessionAndUser';

export default async function getUserIdFromCookieString(
  url?: string,
  cookieString?: string,
) {
  if (!cookieString) {
    return null;
  }

  const cookiePrefix = url?.startsWith('https:') ? '__Secure-' : '';
  const tokenCookieKey = `${cookiePrefix}next-auth.session-token`;

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
