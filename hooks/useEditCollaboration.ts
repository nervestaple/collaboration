import { Collaboration } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import fetchAPI from '../utils/fetchAPI';

import useRefreshData from './useRefreshData';

export default function useEditCollaboration(collaboration: Collaboration) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(collaboration.name);
  const refreshData = useRefreshData();

  const handleSubmit = useCallback(async () => {
    await fetchAPI(`collaborations/${collaboration.id}`, {
      method: 'PATCH',
      body: { name },
    });
    setIsEditing(false);
    refreshData();
  }, [collaboration.id, refreshData, name]);

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
