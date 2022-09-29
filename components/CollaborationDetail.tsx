import {
  Avatar,
  Box,
  Divider,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import useSWR from 'swr';

import type { CollaborationExtended } from '../db/getCollaborationById';

import Card from './Card';
import Chat from './Chat';

interface Props {
  collaborationId: number | null;
}

export default function CollaborationDetail({ collaborationId }: Props) {
  const avatarBg = useColorModeValue('gray.50', 'gray.500');
  const { data: collaboration } = useSWR<CollaborationExtended>(
    collaborationId === null ? null : `/api/collaborations/${collaborationId}`,
    { suspense: true, revalidateOnMount: true },
  );

  if (!collaboration) {
    return null;
  }

  return (
    <Card title={collaboration.name} maxH="100%">
      <Box w="full">
        <HStack bg={avatarBg} w="full" p={2} rounded="lg">
          <AnimatePresence>
            {collaboration.members.map((member) => (
              <motion.div
                key={member.userId}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <Avatar name={member.user.name} />
              </motion.div>
            ))}
          </AnimatePresence>
        </HStack>
      </Box>

      <Divider />

      <Chat collaboration={collaboration} />
    </Card>
  );
}
