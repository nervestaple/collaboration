import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

import NavBar from './NavBar';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Flex
      w="full"
      minH="100vh"
      position="relative"
      overflow="hidden"
      flexDir="column"
    >
      <NavBar />

      <Box position="absolute" inset={0} pt="64px">
        <Box p="24px" w="full" h="full">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
