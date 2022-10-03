import getAPIPath from './getAPIPath';

export default async function fetchAPI(
  pathname: string,
  options?: { method?: string; body?: Record<string, unknown> | null } | null,
  params?: Record<string, string>,
) {
  if (typeof window === 'undefined') {
    return null;
  }

  const defaultedOptions: RequestInit = {
    method: options?.method || 'GET',
    body: options?.body ? JSON.stringify(options.body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const url = new URL(window.origin);
  url.pathname = getAPIPath(pathname);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
  }

  const res = await fetch(url.toString(), defaultedOptions);

  if (!res.ok) {
    const { error } = await res.json();
    const e = new Error(error);
    (e as Error & { status: number }).status = res.status;
    throw e;
  }

  try {
    return await res.json();
  } catch (e) {
    console.error(e);
  }

  return null;
}
