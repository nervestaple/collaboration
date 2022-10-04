import {
  Avatar,
  AvatarBadge,
  Box,
  HStack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

import type { CollaborationExtended } from '../db/getCollaborationById';
import { SERVER_CHAT_STATUS_KEY } from '../utils/constants';
import InviteCollaborator from './InviteCollaborator';

interface ServerStatusMessage {
  onlineUserIds: string[];
}

interface Props {
  members: CollaborationExtended['members'];
  socket: Socket | null;
  isInvite: boolean;
}

export default function CollaborationMembers({
  members,
  socket,
  isInvite,
}: Props) {
  const [onlineUserIds, setOnlineUserIds] = useState(new Set<string>());
  const avatarBg = useColorModeValue('gray.50', 'gray.500');

  useEffect(() => {
    function handleStatusMessageReceived({
      onlineUserIds,
    }: ServerStatusMessage) {
      setOnlineUserIds(new Set(onlineUserIds));
    }

    socket?.on(SERVER_CHAT_STATUS_KEY, handleStatusMessageReceived);

    return () => {
      socket?.off(SERVER_CHAT_STATUS_KEY, handleStatusMessageReceived);
    };
  }, [socket]);

  return (
    <Box w="full" pb={4}>
      <HStack>
        {!isInvite && <InviteCollaborator />}

        <HStack bg={avatarBg} w="full" p={2} rounded="lg" overflowX="auto">
          <AnimatePresence>
            {members.map(({ user }) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ cursor: 'pointer' }}
              >
                <Tooltip label={user.name}>
                  <Avatar name={user.name || undefined} src={user.image || ''}>
                    <AvatarBadge
                      boxSize="1.25em"
                      bg={onlineUserIds.has(user.id) ? 'green.500' : 'red.500'}
                      transition="0.15s background-color ease-in-out"
                    />
                  </Avatar>
                </Tooltip>
              </motion.div>
            ))}
          </AnimatePresence>
        </HStack>
      </HStack>
    </Box>
  );
}
