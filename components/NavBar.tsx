import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import UserMenu from './UserMenu';

export default function NavBar() {
  const bg = useColorModeValue('#EAEFF3', 'gray.700');
  return (
    <Flex
      bg={bg}
      w="full"
      h="64px"
      px="32px"
      alignItems="center"
      justifyContent="space-between"
      boxShadow="lg"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
    >
      <Text fontWeight="bold">Collaboration</Text>
      <UserMenu />
    </Flex>
  );
}
