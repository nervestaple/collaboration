import { Grid, GridItem } from '@chakra-ui/react';

import useSelectedCollaborationId from '../hooks/useSelectedCollaborationId';

import CollaborationList from './CollaborationList';
import CollaborationDetail from './CollaborationDetail';

export default function Collaborations() {
  const selectedCollaborationId = useSelectedCollaborationId();

  return (
    <Grid w="full" h="full" gridTemplateColumns="1fr 1fr" gridGap="16px">
      <GridItem minH={0} minW={0}>
        <CollaborationList selectedId={selectedCollaborationId} />
      </GridItem>

      <GridItem minH={0} minW={0}>
        <CollaborationDetail
          collaborationId={selectedCollaborationId}
          key={selectedCollaborationId}
        />
      </GridItem>
    </Grid>
  );
}
