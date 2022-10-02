import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

import type { CollaborationsAndInvites } from '../db/getCollaborationsOfUser';
import MotionListItem from './MotionListItem';
import Link from 'next/link';
import InviteResponseActions from './InviteResponseActions';

interface Props {
  invite: CollaborationsAndInvites['invites'][number];
  isSelected: boolean;
}

export default function InviteListItem({ invite, isSelected }: Props) {
  const bg = useColorModeValue('gray.300', 'gray.600');
  const selectedBg = useColorModeValue('gray.200', 'gray.500');

  return (
    <MotionListItem
      isSelected={isSelected}
      selectedBg={selectedBg}
      selectedBorderColor="blue.500"
      bg={bg}
      w="full"
      transition="0.15s background-color ease-in-out, 0.15s border-color ease-in-out"
      pl={4}
      pr={2}
      py={2}
      cursor="pointer"
      borderLeft="4px solid transparent"
    >
      <Link href={`/collaborations/${invite.collaborationId}`}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontStyle="italic">{invite.collaboration.name}</Text>
          <InviteResponseActions collaborationId={invite.collaborationId} />
        </Flex>
      </Link>
    </MotionListItem>
  );
}
