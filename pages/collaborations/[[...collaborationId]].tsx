import { SWRConfig } from 'swr';
import type { GetServerSidePropsContext } from 'next';
import { Box } from '@chakra-ui/react';

import getUserIdFromSession from '../../utils/getUserIdFromSession';
import getCollaborationsOfUser from '../../db/getCollaborationsOfUser';
import Collaborations from '../../components/Collaborations';
import getCollaborationById from '../../db/getCollaborationById';

type InitialData = Record<
  string,
  Record<string, unknown> | Record<string, unknown>[]
>;

interface Props {
  initialData?: InitialData;
}

interface Params {
  collaborationId: string[];
  [key: string]: string | string[];
}

export async function getServerSideProps({
  req,
  res,
  query: { collaborationId: collaborationIdParam },
}: GetServerSidePropsContext<Params>): Promise<{
  props: Props;
}> {
  const userId = await getUserIdFromSession(req, res);
  if (userId === null) {
    return { props: {} };
  }

  const collaborations = await getCollaborationsOfUser(userId);
  const initialData: InitialData = {
    '/api/collaborations': collaborations,
  };

  if (
    !Array.isArray(collaborationIdParam) ||
    collaborationIdParam.length !== 1
  ) {
    return { props: { initialData } };
  }

  const collaborationId = parseInt(collaborationIdParam[0]);
  if (!isFinite(collaborationId)) {
    return { props: { initialData } };
  }

  const collaboration = await getCollaborationById(userId, collaborationId);
  if (!collaboration) {
    return { props: { initialData } };
  }

  initialData[`/api/collaborations/${collaborationId}`] = collaboration;

  return { props: { initialData } };
}

export default function CollaborationsPage({ initialData }: Props) {
  return (
    <SWRConfig value={{ fallback: initialData }}>
      <Collaborations />
    </SWRConfig>
  );
}
