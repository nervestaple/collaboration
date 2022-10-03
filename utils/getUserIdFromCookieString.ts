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
    console.error('missing sessionToken', {
      cookies,
      sessionToken,
      cookiePrefix,
      tokenCookieKey,
    });
    return null;
  }

  const sessionAndUser = await getSessionAndUser(sessionToken);
  if (!sessionAndUser) {
    console.error('missing sessionAndUser', sessionAndUser);
    return null;
  }

  return sessionAndUser.user.id;
}
