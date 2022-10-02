import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { isFinite } from 'lodash-es';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import type { CollaborationExtended } from '../db/getCollaborationById';
import fetchAPI from '../utils/fetchAPI';

import Card from './Card';
import Chat from './Chat';
import InviteCollaborator from './InviteCollaborator';
import InviteResponseActions from './InviteResponseActions';
import LeaveCollaborationButton from './LeaveCollaborationButton';

interface Props {
  collaborationId: number | null;
}

export default function CollaborationDetail({ collaborationId }: Props) {
  const { data } = useSession({ required: true });
  const avatarBg = useColorModeValue('gray.50', 'gray.500');
  const { data: collaboration, error } = useSWR<CollaborationExtended>(
    collaborationId === null ? null : `/collaborations/${collaborationId}`,
    { revalidateOnMount: true },
  );

  if (collaborationId === null || !collaboration) {
    return null;
  }

  const userEmail = data?.user?.email;
  const invitedEmails = collaboration.invites.map(
    ({ user: { email } }) => email,
  );
  const isInvite = invitedEmails.some((email) => email === userEmail);

  const action = isInvite ? (
    <InviteResponseActions collaborationId={collaborationId} />
  ) : (
    <LeaveCollaborationButton collaborationId={collaborationId} />
  );

  return (
    <Card
      cardTitle={collaboration.name}
      cardTag={isInvite && 'Invited to...'}
      cardAction={action}
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
