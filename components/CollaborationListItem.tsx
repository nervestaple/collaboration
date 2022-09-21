import { EditIcon } from '@chakra-ui/icons';
import { ButtonGroup, IconButton, Input, Text } from '@chakra-ui/react';
import { Collaboration } from '@prisma/client';

interface Props {
  collaboration: Collaboration;
  isSelected: boolean;
  workingName: string | null;
  onWorkingNameChange: (newName: string) => void;
  onClick: (id: number) => void;
  onSubmit: () => void;
}

export default function CollaborationListItem({
  collaboration,
  onClick,
  isSelected,
  workingName,
  onWorkingNameChange,
  onSubmit,
}: Props) {
  const isEditing = workingName !== null && isSelected;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        paddingRight: 4,
      }}
      onClick={() => onClick(collaboration.id)}
    >
      <ButtonGroup w="full" justifyContent="space-between" alignItems="center">
        {isEditing ? (
          <>
            <Input
              px={4}
              py={2}
              name="name"
              onChange={(e) => onWorkingNameChange(e.target.value)}
              value={workingName || collaboration.name}
              autoFocus={true}
            />
            <IconButton
              disabled={workingName === ''}
              size="sm"
              aria-label="edit name"
              icon={<>⏎</>}
              onClick={onSubmit}
            />
          </>
        ) : (
          <>
            <Text px={4} py={2} noOfLines={1}>
              {collaboration.name}
            </Text>
            <IconButton
              size="sm"
              aria-label="edit name"
              icon={<EditIcon />}
              onClick={() => onWorkingNameChange(collaboration.name)}
            />
          </>
        )}
      </ButtonGroup>
    </form>
  );
}
