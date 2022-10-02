import {
  Avatar,
  Box,
  Divider,
  Heading,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import type { CollaborationExtended } from '../db/getCollaborationById';
import fetchAPI from '../utils/fetchAPI';

import Card from './Card';
import Chat from './Chat';
import InviteCollaborator from './InviteCollaborator';

interface Props {
  collaborationId: number | null;
}

export default function CollaborationDetail({ collaborationId }: Props) {
  const { data } = useSession({ required: true });
  const avatarBg = useColorModeValue('gray.50', 'gray.500');
  const { data: collaboration, error } = useSWR<CollaborationExtended>(
    collaborationId === null ? null : `/collaborations/${collaborationId}`,
    fetchAPI,
    { revalidateOnMount: true },
  );

  if (!collaboration) {
    return null;
  }

  const userEmail = data?.user?.email;
  const invitedEmails = collaboration.invites.map(
    ({ user: { email } }) => email,
  );
  const isInvite = invitedEmails.some((email) => email === userEmail);
  console.log({ collaboration, error });

  return (
    <Card
      cardTitle={collaboration.name}
      cardTag={isInvite && 'Invited to...'}
      maxH="100%"
    >
      <Box w="full" pb={4}>
        <HStack>
          {!isInvite && <InviteCollaborator />}

          <HStack bg={avatarBg} w="full" p={2} rounded="lg" overflowX="auto">
            <AnimatePresence>
              {collaboration.members.map((member) => (
                <motion.div
                  key={member.userId}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <Tooltip label={member.user.name}>
                    <Avatar name={member.user.name} />
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>
          </HStack>
        </HStack>
      </Box>

      {!isInvite && (
        <>
          <Divider />
          <Chat collaboration={collaboration} />
        </>
      )}
    </Card>
  );
}
