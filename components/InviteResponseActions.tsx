import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import fetchAPI from '../utils/fetchAPI';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';

interface Props {
  collaborationId: number;
}

export default function InviteResponseActions({ collaborationId }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  async function sendInviteResponse(inviteAccepted: boolean) {
    await fetchAPI(`/collaborations/${collaborationId}/invites`, {
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
  );
}
