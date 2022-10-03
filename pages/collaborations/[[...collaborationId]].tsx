import { SWRConfig } from 'swr';
import type { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import type {
  Collaboration,
  UserCollaborationInvite,
  UserCollaboration,
} from '@prisma/client';

import getCollaborationsOfUser from '../../db/getCollaborationsOfUser';
import Collaborations from '../../components/Collaborations';
import getCollaborationById from '../../db/getCollaborationById';
import { authOptions } from '../api/auth/[...nextauth]';

export interface CollaborationsAndInvites {
  invites: Array<UserCollaborationInvite & { collaboration: Collaboration }>;
  collaborations: Array<UserCollaboration & { collaboration: Collaboration }>;
}

interface InitialData {
  '/collaborations': CollaborationsAndInvites;
  [key: string]: Collaboration | CollaborationsAndInvites;
}

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
  const session = await unstable_getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return { props: {} };
  }

  const collaborations = await getCollaborationsOfUser(userId);
  if (!collaborations) {
    return { props: {} };
  }

  const initialData: InitialData = {
    '/collaborations': collaborations,
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

  initialData[`/collaborations/${collaborationId}`] = collaboration;

  return { props: { initialData } };
}

export default function CollaborationsPage({ initialData }: Props) {
  if (!initialData) {
    return null;
  }

  return (
    <SWRConfig value={{ fallback: initialData, suspense: true }}>
      <Collaborations />
    </SWRConfig>
  );
}
