import { useRouter } from 'next/router';
import { useCallback } from 'react';

export default function useRefreshData() {
  const router = useRouter();
  return useCallback(() => router.replace(router.asPath), [router]);
}
