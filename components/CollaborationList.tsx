import { Button, Spinner } from '@chakra-ui/react';

import { UserWithCollaborations } from '../db/getUserWithCollaborations';
import useRefreshData from '../hooks/useRefreshData';
import fetchAPI from '../utils/fetchAPI';
import CollaborationListItem from './CollaborationListItem';
import MotionList from './MotionList';
import MotionListItem from './MotionListItem';

interface Props {
  selectedId: number | null;
  collaborations: UserWithCollaborations['collaborations'] | null;
  onItemClick: (id: number) => void;
  workingName: string | null;
  onWorkingNameChange: (newName: string) => void;
  onSubmitName: () => void;
}

export default function CollaborationList({
  selectedId,
  collaborations,
  onItemClick,
  workingName,
  onWorkingNameChange,
  onSubmitName,
}: Props) {
  const refreshData = useRefreshData();

  if (!collaborations) {
    return <Spinner />;
  }

  return (
    <>
      <MotionList py={4} spacing={2} w="full">
        {collaborations.map(({ collaboration }) => (
          <MotionListItem
            key={collaboration.id}
            bg={collaboration.id === selectedId ? 'orange.100' : 'blue.50'}
            w="full"
            transition="0.15s background-color ease-in-out"
          >
            <CollaborationListItem
              collaboration={collaboration}
              onClick={onItemClick}
              isSelected={collaboration.id === selectedId}
              workingName={workingName}
              onWorkingNameChange={onWorkingNameChange}
              onSubmit={onSubmitName}
            />
          </MotionListItem>
        ))}
      </MotionList>

      <Button
        onClick={async () => {
          await fetchAPI('collaborations', { method: 'POST' });
          refreshData();
        }}
      >
        Create
      </Button>
    </>
  );
}
