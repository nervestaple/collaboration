import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { type FormEvent, useEffect, useState, useMemo } from 'react';
import { type Socket } from 'socket.io-client';

import type { CollaborationExtended } from '../db/getCollaborationById';

import {
  CLIENT_CHAT_MESSAGE_KEY,
  SERVER_CHAT_MESSAGE_KEY,
} from '../utils/constants';
import MotionList from './MotionList';
import MotionListItem from './MotionListItem';

interface ServerChatMessage {
  id: number;
  userId: string;
  text: string;
}

interface Props {
  collaboration: CollaborationExtended;
  socket: Socket | null;
}

export default function Chat({ collaboration, socket }: Props) {
  const toast = useToast();
  const [{ messages }, setMessages] = useState<{
    messages: ServerChatMessage[];
    seenMessageIds: Set<number>;
  }>(() => ({
    messages: collaboration.messages,
    seenMessageIds: new Set(collaboration.messages.map(({ id }) => id)),
  }));
  const [inputText, setInputText] = useState('');

  const userMap = useMemo(
    () =>
      new Map(
        collaboration.members.map((member) => [member.userId, member.user]),
      ),
    [collaboration],
  );

  useEffect(() => {
    function handleChatMessageReceived(message: ServerChatMessage) {
      setMessages((old) => {
        if (old.seenMessageIds.has(message.id)) {
          return old;
        }

        return {
          messages: [...old.messages, message],
          seenMessageIds: new Set([...old.seenMessageIds, message.id]),
        };
      });
    }

    socket?.on(SERVER_CHAT_MESSAGE_KEY, handleChatMessageReceived);

    return () => {
      socket?.off(SERVER_CHAT_MESSAGE_KEY, handleChatMessageReceived);
    };
  }, [socket]);

  function handleSend() {
    if (!socket || !socket.connected) {
      toast({ title: 'Failed to send message.', status: 'error' });
      return;
    }

    socket.emit(CLIENT_CHAT_MESSAGE_KEY, inputText);
    setInputText('');
  }

  function handleSendSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend();
  }

  return (
    <>
      <MotionList
        w="full"
        minH={0}
        overflow="auto"
        overscrollBehaviorY="contain"
        scrollSnapType="y proximity"
      >
        {messages.map((message, i) => {
          const user = userMap.get(message.userId);
          return (
            <MotionListItem
              key={message.id}
              my={2}
              scrollSnapAlign={i === messages.length - 1 ? 'end' : undefined}
            >
              <Tooltip label={user?.name}>
                <Avatar
                  size="xs"
                  mx={2}
                  name={user?.name || undefined}
                  src={user?.image || ''}
                  cursor="pointer"
                />
              </Tooltip>
              {message.text}
            </MotionListItem>
          );
        })}
      </MotionList>

      <form onSubmit={handleSendSubmit} style={{ width: '100%' }}>
        <InputGroup size="md" mt={4}>
          <Input
            pr="4.5rem"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              name="send"
              type="submit"
              disabled={inputText === ''}
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </>
  );
}
