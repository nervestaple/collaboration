import { Flex, Text } from '@chakra-ui/react';
import UserMenu from './UserMenu';

export default function NavBar() {
  return (
    <Flex
      w="full"
      h="64px"
      px="32px"
      alignItems="center"
      justifyContent="space-between"
      boxShadow="lg"
      bg="white"
    >
      <Text fontWeight="bold">Collaboration</Text>
      <UserMenu />
    </Flex>
  );
}
