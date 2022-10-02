import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { isFinite } from 'lodash-es';
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import io, { type Socket } from 'socket.io-client';

import type { CollaborationExtended } from '../db/getCollaborationById';

import useSelectedCollaborationId from '../hooks/useSelectedCollaborationId';
import { CHAT_MESSAGE_KEY } from '../utils/constants';
import MotionList from './MotionList';
import MotionListItem from './MotionListItem';

interface ServerChatMessage {
  id: number;
  userId: number;
  text: string;
}

interface Props {
  collaboration: CollaborationExtended;
}

export default function Chat({ collaboration }: Props) {
  const toast = useToast();
  const [{ messages }, setMessages] = useState<{
    messages: ServerChatMessage[];
    seenMessageIds: Set<number>;
  }>(() => ({
    messages: collaboration.messages,
    seenMessageIds: new Set(collaboration.messages.map(({ id }) => id)),
  }));
  const socket = useRef<Socket | null>(null);
  const [inputText, setInputText] = useState('');
  const collaborationId = useSelectedCollaborationId();

  const userMap = useMemo(
    () =>
      new Map(
        collaboration.members.map((member) => [member.userId, member.user]),
      ),
    [collaboration],
  );

  // const tryConnect = useCallback(async () => {
  //   await fetch('/api/chat-subscribe');
  //   socket.current = io({
  //     query: { collaborationId },
  //   });
  // }, [collaborationId]);

  useEffect(() => {
    async function openSocket() {
      if (!isFinite(collaborationId)) {
        return;
      }

      if (socket.current === null || !socket.current.connected) {
        await fetch('/api/chat-subscribe');
        socket.current = io({
          query: { collaborationId },
        });
      }

      socket.current.on('connect', () => {
        console.log('connected');
      });

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
      socket.current.on(CHAT_MESSAGE_KEY, handleChatMessageReceived);
    }

    openSocket();

    return () => {
      socket.current?.close();
      socket.current = null;
    };
  }, [collaborationId]);

  function handleSend() {
    if (!socket.current || !socket.current.connected) {
      toast({ title: 'Failed to send message.', status: 'error' });
      return;
    }

    socket.current.emit('chat-message', inputText);
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
        {messages.map((message, i) => (
          <MotionListItem
            key={message.id}
            my={2}
            scrollSnapAlign={i === messages.length - 1 ? 'end' : undefined}
          >
            <Avatar size="xs" mx={2} name={userMap.get(message.userId)?.name} />
            {message.text}
          </MotionListItem>
        ))}
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
