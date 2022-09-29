import { useRouter } from 'next/router';

export default function useSelectedCollaborationId() {
  const { query } = useRouter();
  if (
    !Array.isArray(query.collaborationId) ||
    query.collaborationId.length !== 1
  ) {
    return null;
  }

  const selectedCollaborationId = parseInt(query.collaborationId[0]);
  if (!isFinite(selectedCollaborationId)) {
    return null;
  }

  return selectedCollaborationId;
}
