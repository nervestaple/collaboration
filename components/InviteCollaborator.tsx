import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { type FormEvent, useRef, useState } from 'react';
import ReactFocusLock from 'react-focus-lock';
import { useSWRConfig } from 'swr';

import useSelectedCollaborationId from '../hooks/useSelectedCollaborationId';
import fetchAPI from '../utils/fetchAPI';

export default function InviteCollaborator() {
  const { mutate } = useSWRConfig();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const { onOpen, onClose, isOpen } = useDisclosure();
  const ref = useRef(null);
  const collaborationId = useSelectedCollaborationId();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (collaborationId === null) {
      return;
    }

    try {
      const key = `/collaborations/${collaborationId}`;
      await fetchAPI(`${key}/invites`, {
        method: 'POST',
        body: { email },
      });
      onClose();
      toast({ title: `Invited ${email}` });
      mutate(key);
      mutate('/collaborations');
    } catch (err: unknown) {
      console.error(err);
      toast({ status: 'error', title: (err as Error).message });
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={ref}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton
          aria-label="Invite Collaborator"
          icon={<AddIcon />}
          rounded="full"
        />
      </PopoverTrigger>

      <PopoverContent>
        <form onSubmit={handleSubmit}>
          <ReactFocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <InputGroup size="md">
              <Input
                ref={ref}
                pr="4.5rem"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />

              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  name="send"
                  type="submit"
                  disabled={email === ''}
                >
                  Invite
                </Button>
              </InputRightElement>
            </InputGroup>
          </ReactFocusLock>
        </form>
      </PopoverContent>
    </Popover>
  );
}
