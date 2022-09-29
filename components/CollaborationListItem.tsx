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
import useSWR, { useSWRConfig } from 'swr';

import useRefreshData from '../hooks/useRefreshData';

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
  const [name, setName] = useState(collaboration.name);

  const refreshData = useRefreshData();
  const handleSubmit = useCallback(async () => {
    try {
      const key = `/api/collaborations/${collaboration.id}`;
      // mutate(
      //   key,
      //   async (todos) => {
      //     const updatedTodo = await fetch(key, {
      //       method: 'PATCH',
      //       body: JSON.stringify({ completed: true }),
      //     });
      //     setIsEditing(false);
      //     refreshData();
      //   },
      //   {
      //     optimisticData: { ...collaboration, name },
      //     rollbackOnError: true,
      //     populateCache: true,
      //     revalidate: false,
      //   },
      // );
    } catch (e) {
      toast({ status: 'error', title: 'Error updating collaboration name' });
    }

    // await fetchAPI(`collaborations/${collaboration.id}`, {
    //   method: 'PATCH',
    //   body: { name },
    // });
  }, [collaboration, mutate, toast, name, refreshData]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          setIsEditing(false);
        case 'Enter':
          handleSubmit();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, handleSubmit]);

  const ref = useRef<HTMLFormElement>(null);
  useOutsideClick({
    handler() {
      setIsEditing(false);
    },
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
                {name}
              </Text>

              {isSelected && (
                <IconButton
                  size="sm"
                  aria-label="edit name"
                  icon={<EditIcon />}
                  onClick={() => {
                    setIsEditing(true);
                    setName(collaboration.name);
                  }}
                />
              )}
            </>
          )}
        </ButtonGroup>
      </form>
    </Link>
  );
}
