import { useMemo, useState } from 'react';
import { Flex, HStack } from '@chakra-ui/react';
import { unstable_getServerSession } from 'next-auth';
import type { GetServerSidePropsContext } from 'next';

import Card from '../components/Card';
import NavBar from '../components/NavBar';
import { authOptions } from './api/auth/[...nextauth]';
import getUserWithCollaborations, {
  UserWithCollaborations,
} from '../db/getUserWithCollaborations';
import CollaborationList from '../components/CollaborationList';
import Collaborations from '../components/Collaborations';

interface Props {
  user: UserWithCollaborations | null;
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext): Promise<{ props: Props }> {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await getUserWithCollaborations(session?.user?.email);

  return {
    props: { user },
  };
}

export default function Home({ user }: Props) {
  return (
    <Flex
      w="full"
      minH="100vh"
      position="relative"
      overflow="hidden"
      flexDir="column"
    >
      <NavBar />
      <Collaborations collaborations={user?.collaborations || null} />
    </Flex>
  );
}
