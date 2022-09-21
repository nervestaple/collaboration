import { HStack } from '@chakra-ui/react';
import { Reducer, useCallback, useEffect, useReducer } from 'react';

import Card from '../components/Card';
import CollaborationList from '../components/CollaborationList';
import { UserWithCollaborations } from '../db/getUserWithCollaborations';
import useRefreshData from '../hooks/useRefreshData';
import fetchAPI from '../utils/fetchAPI';

interface Props {
  collaborations: UserWithCollaborations['collaborations'] | null;
}

interface State {
  selectedCollaborationId: number | null;
  // TODO - if we want to edit more fields this should be a composite 'workingCollaboration'
  isEditing: boolean;
  workingName: string | null;
}

type Action =
  | { type: 'selectCollaboration'; newId: number }
  | { type: 'editName'; newName: string }
  | { type: 'startEditingName' }
  | { type: 'stopEditingName' };

const reducer: Reducer<State, Action> = (state, action) => {
  console.log({ action });
  switch (action.type) {
    case 'selectCollaboration':
      const didCollaborationChange =
        state.selectedCollaborationId === action.newId;
      return {
        ...state,
        selectedCollaborationId: action.newId,
        workingName: null,
        isEditing: didCollaborationChange ? false : state.isEditing,
      };
    case 'editName':
      return { ...state, workingName: action.newName };
    case 'startEditingName':
      return { ...state, isEditing: true, workingName: null };
    case 'stopEditingName':
      return { ...state, isEditing: false, workingName: null };
  }
};

const initialState = {
  selectedCollaborationId: null,
  isEditing: false,
  workingName: null,
};

export default function Collaborations({ collaborations }: Props) {
  const [{ selectedCollaborationId, workingName }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const refreshData = useRefreshData();
  const handleSubmit = useCallback(async () => {
    await fetchAPI(`collaborations/${selectedCollaborationId}`, {
      method: 'PATCH',
      body: { name: workingName },
    });
    dispatch({ type: 'stopEditingName' });
    refreshData();
  }, [selectedCollaborationId, refreshData, workingName]);

  useEffect(() => {
    if (!workingName) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          dispatch({ type: 'stopEditingName' });
        case 'Enter':
          handleSubmit();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [workingName, handleSubmit]);

  function getCollaborationById(id: number | null) {
    if (id === null) {
      return null;
    }
    return collaborations?.find((c) => c.collaborationId === id) || null;
  }

  const selectedCollaboration = getCollaborationById(selectedCollaborationId);
  return (
    <HStack flexGrow={1} p="32px" alignItems="flex-start">
      <Card title="Collaborations" minW="66.6%">
        <CollaborationList
          collaborations={collaborations}
          onItemClick={(newId) =>
            dispatch({ type: 'selectCollaboration', newId })
          }
          workingName={workingName}
          onWorkingNameChange={(newName) =>
            dispatch({ type: 'editName', newName })
          }
          onSubmitName={handleSubmit}
          selectedId={selectedCollaborationId}
        />
      </Card>

      {selectedCollaboration && (
        <Card title={selectedCollaboration?.collaboration.name} minW="33.3%">
          XXX
        </Card>
      )}
    </HStack>
  );
}
