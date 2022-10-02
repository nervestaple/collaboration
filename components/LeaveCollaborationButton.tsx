import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useSWRConfig } from 'swr';
import fetchAPI from '../utils/fetchAPI';

interface Props {
  collaborationId: number;
}

export default function LeaveCollaborationButton({ collaborationId }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  async function handleLeaveClick() {
    await fetchAPI(`/collaborations/${collaborationId}`, { method: 'DELETE' });
    router.push('/collaborations');
    mutate('/collaborations');
    onClose();
  }

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Leave
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave Collaboration
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You&lsquo;ll need to be re-invited if you leave.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLeaveClick} ml={3}>
                Leave
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
