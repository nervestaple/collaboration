import { Divider, Heading } from '@chakra-ui/react';
import MotionList from './MotionList';

import type { CollaborationsAndInvites } from '../db/getCollaborationsOfUser';
import useSelectedCollaborationId from '../hooks/useSelectedCollaborationId';
import InviteListItem from './InviteListItem';

interface Props {
  invites: CollaborationsAndInvites['invites'];
}

export default function InvitesList({ invites }: Props) {
  const selectedCollaborationId = useSelectedCollaborationId();
  return (
    <>
      <Heading size="md">Invites</Heading>

      <MotionList py={4} spacing={2} w="full" maxH="100%" overflow="auto">
        {invites.map((invite) => (
          <InviteListItem
            key={`${invite.collaborationId}-${invite.userId}`}
            isSelected={selectedCollaborationId === invite.collaborationId}
            invite={invite}
          />
        ))}
      </MotionList>
    </>
  );
}
