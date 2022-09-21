const API_PREFIX = '/api';

export default async function fetchAPI(
  pathname: string,
  options?: { method?: string; body?: Record<string, unknown> | null } | null,
  params?: Record<string, string>,
) {
  const defaultedOptions: RequestInit = {
    method: options?.method || 'GET',
    body: options?.body ? JSON.stringify(options.body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const url = new URL(window.origin);

  const cleanedPathname = pathname.startsWith('/')
    ? pathname.slice(1)
    : pathname;

  url.pathname = `${API_PREFIX}/${cleanedPathname}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
  }

  const res = await fetch(url.toString(), defaultedOptions);

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch (e) {
    console.error(e);
  }

  return null;
}
