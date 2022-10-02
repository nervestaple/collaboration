import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import type { CollaborationsAndInvites } from '../db/getCollaborationsOfUser';
import MotionListItem from './MotionListItem';
import fetchAPI from '../utils/fetchAPI';
import Link from 'next/link';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';

interface Props {
  invite: CollaborationsAndInvites['invites'][number];
  isSelected: boolean;
}

export default function InviteListItem({ invite, isSelected }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const bg = useColorModeValue('gray.300', 'gray.600');
  const selectedBg = useColorModeValue('gray.200', 'gray.500');

  async function sendInviteResponse(inviteAccepted: boolean) {
    await fetchAPI(`/collaborations/${invite.collaborationId}/invites`, {
      method: 'PATCH',
      body: { inviteAccepted },
    });

    if (!inviteAccepted) {
      router.push('/collaborations');
    }

    mutate('/collaborations');
  }

  function handleAcceptClick() {
    sendInviteResponse(true);
  }

  function handleRejectClick() {
    sendInviteResponse(false);
  }

  return (
    <Link href={`/collaborations/${invite.collaborationId}`}>
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
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontStyle="italic">{invite.collaboration.name}</Text>
          <HStack>
            <Tooltip label="Accept Invite">
              <IconButton
                onClick={handleAcceptClick}
                colorScheme="green"
                size="sm"
                aria-label="accept invite"
                icon={<CheckIcon />}
                rounded="full"
              />
            </Tooltip>

            <Tooltip label="Reject Invite">
              <IconButton
                onClick={handleRejectClick}
                colorScheme="red"
                size="sm"
                aria-label="reject invite"
                icon={<CloseIcon />}
                rounded="full"
              />
            </Tooltip>
          </HStack>
        </Flex>
      </MotionListItem>
    </Link>
  );
}
