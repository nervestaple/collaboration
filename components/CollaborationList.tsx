import { Button, Divider, Spinner, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { CollaborationsAndInvites } from '../pages/collaborations/[[...collaborationId]]';
import fetchAPI from '../utils/fetchAPI';
import Card from './Card';
import CollaborationListItem from './CollaborationListItem';
import InvitesList from './InvitesList';
import MotionList from './MotionList';
import MotionListItem from './MotionListItem';

interface Props {
  selectedId: number | null;
}

export default function CollaborationList({ selectedId }: Props) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);
  const { data } = useSWR<CollaborationsAndInvites>('/collaborations');

  const itemBg = useColorModeValue('orange.200', 'orange.700');
  const selectedItemBg = useColorModeValue('orange.100', 'orange.600');

  if (!data) {
    return <Spinner />;
  }

  const { collaborations, invites } = data;

  async function handleCreateClick() {
    const newCollaboration = await fetchAPI('collaborations', {
      method: 'POST',
    });
    mutate('/collaborations');
    router.push(`/collaborations/${newCollaboration.id}`);
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current?.scrollHeight;
      }
    }, 100);
  }

  return (
    <Card cardTitle="Collaborations" maxH="100%">
      {invites.length > 0 && (
        <>
          <InvitesList invites={invites} />
          <Divider />
        </>
      )}

      <MotionList
        py={4}
        spacing={2}
        w="full"
        maxH="100%"
        overflow="auto"
        ref={listRef}
      >
        {collaborations.map(({ collaboration }) => (
          <MotionListItem
            key={collaboration.id}
            bg={itemBg}
            isSelected={collaboration.id === selectedId}
            selectedBg={selectedItemBg}
            selectedBorderColor="blue.500"
            w="full"
            transition="0.15s background-color ease-in-out"
          >
            <CollaborationListItem
              collaboration={collaboration}
              isSelected={collaboration.id === selectedId}
            />
          </MotionListItem>
        ))}
      </MotionList>

      <Button onClick={handleCreateClick}>Create</Button>
    </Card>
  );
}
