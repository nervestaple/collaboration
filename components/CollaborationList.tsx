import { Button, Spinner, useColorModeValue } from '@chakra-ui/react';
import type { Collaboration } from '@prisma/client';
import useSWR from 'swr';

import useRefreshData from '../hooks/useRefreshData';
import Card from './Card';
import CollaborationListItem from './CollaborationListItem';
import MotionList from './MotionList';
import MotionListItem from './MotionListItem';

interface Props {
  selectedId: number | null;
}

export default function CollaborationList({ selectedId }: Props) {
  const { data: collaborations } = useSWR<Collaboration[]>(
    '/api/collaborations',
  );

  const itemBg = useColorModeValue('orange.100', 'orange.700');
  const selectedItemBg = useColorModeValue('blue.50', 'blue.700');

  const refreshData = useRefreshData();

  if (!collaborations) {
    return <Spinner />;
  }

  return (
    <Card title="Collaborations">
      <MotionList py={4} spacing={2} w="full">
        {collaborations.map((collaboration) => {
          const isSelected = collaboration.id === selectedId;
          return (
            <MotionListItem
              key={collaboration.id}
              bg={isSelected ? selectedItemBg : itemBg}
              w="full"
              transition="0.15s background-color ease-in-out"
            >
              <CollaborationListItem
                collaboration={collaboration}
                isSelected={collaboration.id === selectedId}
              />
            </MotionListItem>
          );
        })}
      </MotionList>

      <Button
        onClick={async () => {
          // await fetchAPI('collaborations', { method: 'POST' });
          refreshData();
        }}
      >
        Create
      </Button>
    </Card>
  );
}
