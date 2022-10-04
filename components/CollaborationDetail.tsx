import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import type { CollaborationExtended } from '../db/getCollaborationById';

import Card from './Card';
import InviteResponseActions from './InviteResponseActions';
import LeaveCollaborationButton from './LeaveCollaborationButton';
import RealtimeCollaboration from './RealtimeCollaboration';

interface Props {
  collaborationId: number | null;
}

export default function CollaborationDetail({ collaborationId }: Props) {
  const { data } = useSession({ required: true });
  const { data: collaboration } = useSWR<CollaborationExtended>(
    collaborationId === null ? null : `/collaborations/${collaborationId}`,
    { revalidateOnMount: true },
  );

  if (collaborationId === null || !collaboration) {
    return null;
  }

  const userEmail = data?.user?.email;
  const invitedEmails = collaboration.invites.map(
    ({ user: { email } }) => email,
  );
  const isInvite = invitedEmails.some((email) => email === userEmail);

  const action = isInvite ? (
    <InviteResponseActions collaborationId={collaborationId} />
  ) : (
    <LeaveCollaborationButton collaborationId={collaborationId} />
  );

  return (
    <Card
      cardTitle={collaboration.name}
      cardTag={isInvite && 'Invited to...'}
      cardAction={action}
      maxH="100%"
    >
      <RealtimeCollaboration
        collaboration={collaboration}
        isInvite={isInvite}
      />
    </Card>
  );
}
