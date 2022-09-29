import {
  Box,
  BoxProps,
  Flex,
  Heading,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

interface Props {
  title?: React.ReactNode;
}

export default function Card({ children, title, ...props }: BoxProps & Props) {
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <VStack
      py="24px"
      px="32px"
      boxShadow="lg"
      rounded="lg"
      bg={bg}
      alignItems="flex-start"
      {...props}
    >
      {title && (
        <Box minH="48px" maxW="100%" pb="16px">
          <Heading noOfLines={1}>{title}</Heading>
        </Box>
      )}

      {children}
    </VStack>
  );
}
