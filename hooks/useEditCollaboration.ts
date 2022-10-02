import { Collaboration } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import fetchAPI from '../utils/fetchAPI';

export default function useEditCollaboration(collaboration: Collaboration) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(collaboration.name);

  const handleSubmit = useCallback(async () => {
    const key = `collaborations/${collaboration.id}`;
    await fetchAPI(key, {
      method: 'PATCH',
      body: { name },
    });
    mutate(key);
    mutate('/collaborations');
    setIsEditing(false);
  }, [collaboration.id, name]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          setIsEditing(false);
          setName(collaboration.name);
        case 'Enter':
          handleSubmit();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, collaboration.name, handleSubmit]);
}
