import { Divider } from '@chakra-ui/react';
import { isFinite } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import type { CollaborationExtended } from '../db/getCollaborationById';
import useSelectedCollaborationId from '../hooks/useSelectedCollaborationId';
import { SERVER_CHAT_STATUS_KEY } from '../utils/constants';
import Chat from './Chat';
import CollaborationMembers from './CollaborationMembers';

interface Props {
  collaboration: CollaborationExtended;
  isInvite: boolean;
}

export default function RealtimeCollaboration({
  isInvite,
  collaboration,
}: Props) {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const collaborationId = useSelectedCollaborationId();

  useEffect(() => {
    async function openSocket() {
      if (!isFinite(collaborationId)) {
        return;
      }

      if (socket.current && socket.current?.connected) {
        return;
      }

      await fetch('/api/chat-subscribe');
      socket.current = io({
        query: { collaborationId },
      });

      socket.current.on('connect', () => {
        setIsConnected(true);
        console.log('connected', socket.current);
      });

      socket.current?.on(SERVER_CHAT_STATUS_KEY, (msg) => console.log(msg));
    }

    openSocket();

    return () => {
      socket.current?.close();
      setIsConnected(false);
      socket.current = null;
    };
  }, [socket, collaborationId]);

  if (!isConnected) {
    return null;
  }

  return (
    <>
      <CollaborationMembers
        members={collaboration.members}
        socket={socket.current}
        isInvite={isInvite}
      />

      {!isInvite && (
        <>
          <Divider />
          <Chat collaboration={collaboration} socket={socket.current} />
        </>
      )}
    </>
  );
}
