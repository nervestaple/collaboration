const API_PREFIX = '/api';

export default function getAPIPath(path: string) {
  const cleanedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${API_PREFIX}/${cleanedPath}`;
}
