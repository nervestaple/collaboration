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
    console.log('missing sessionToken', { cookies, sessionToken });
    return null;
  }

  const sessionAndUser = await getSessionAndUser(sessionToken);
  if (!sessionAndUser) {
    console.log('missing sessionAndUser', sessionAndUser);
    return null;
  }

  return sessionAndUser.user.id;
}
