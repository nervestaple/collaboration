import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';

export default function UserMenu() {
  const { data } = useSession({ required: true });

  if (!data?.user) {
    return null;
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <HStack>
          <Text>{data.user.name}</Text>
          <Avatar
            src={data.user.image || ''}
            referrerPolicy="no-referrer"
            size="xs"
          />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
      </MenuList>
    </Menu>
  );
}
