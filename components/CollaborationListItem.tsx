import { EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  IconButton,
  Input,
  Text,
  useOutsideClick,
  useToast,
} from '@chakra-ui/react';
import { Collaboration } from '@prisma/client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';

import fetchAPI from '../utils/fetchAPI';

interface Props {
  collaboration: Collaboration;
  isSelected: boolean;
}

export default function CollaborationListItem({
  collaboration,
  isSelected,
}: Props) {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string | null>(null);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
    setName(null);
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setName(collaboration.name);
  }, [collaboration]);

  const handleSubmit = useCallback(async () => {
    try {
      const key = `/collaborations/${collaboration.id}`;
      await fetchAPI(key, {
        method: 'PATCH',
        body: { name },
      });
      mutate('/collaborations');
      mutate(key);
      stopEditing();
    } catch (e) {
      toast({ status: 'error', title: 'Error updating collaboration name' });
    }
  }, [collaboration, mutate, toast, name, stopEditing]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          stopEditing();
        case 'Enter':
          handleSubmit();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, handleSubmit, stopEditing]);

  const ref = useRef<HTMLFormElement>(null);
  useOutsideClick({
    handler: stopEditing,
    ref,
  });

  return (
    <Link href={`/collaborations/${collaboration.id}`}>
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          paddingRight: 4,
        }}
      >
        <ButtonGroup
          w="full"
          justifyContent="space-between"
          alignItems="center"
        >
          {isEditing ? (
            <>
              <Input
                px={4}
                py={2}
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name || collaboration.name}
                autoFocus={true}
              />

              <IconButton
                disabled={name === ''}
                size="sm"
                aria-label="edit name"
                icon={<>⏎</>}
                onClick={handleSubmit}
              />
            </>
          ) : (
            <>
              <Text px={4} py={2} noOfLines={1}>
                {collaboration.name}
              </Text>

              {isSelected && (
                <IconButton
                  size="sm"
                  aria-label="edit name"
                  icon={<EditIcon />}
                  onClick={startEditing}
                />
              )}
            </>
          )}
        </ButtonGroup>
      </form>
    </Link>
  );
}
