import { Center, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';

import useSelectedCollaborationId from '../hooks/useSelectedCollaborationId';

import CollaborationList from './CollaborationList';
import CollaborationDetail from './CollaborationDetail';

export default function Collaborations() {
  const selectedCollaborationId = useSelectedCollaborationId();

  const fallback = (
    <Center flexGrow={1} h="200px">
      <Spinner />
    </Center>
  );

  return (
    <Grid w="full" h="full" gridTemplateColumns="1fr 1fr" gridGap="16px">
      <GridItem minH={0} minW={0}>
        <Suspense fallback={fallback}>
          <CollaborationList selectedId={selectedCollaborationId} />
        </Suspense>
      </GridItem>

      <GridItem minH={0} minW={0}>
        <Suspense fallback={fallback}>
          <CollaborationDetail
            collaborationId={selectedCollaborationId}
            key={selectedCollaborationId}
          />
        </Suspense>
      </GridItem>
    </Grid>
  );
}
