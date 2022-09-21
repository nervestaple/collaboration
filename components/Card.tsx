import { Box, BoxProps, Heading, VStack } from '@chakra-ui/react';

interface Props {
  title?: React.ReactNode;
}

export default function Card({ children, title, ...props }: BoxProps & Props) {
  return (
    <Box py="24px" px="32px" boxShadow="lg" bg="white" rounded="lg" {...props}>
      <VStack alignItems="flex-start" w="full">
        {title && (
          <Heading noOfLines={1} w="full">
            {title}
          </Heading>
        )}
        <Box w="full">{children}</Box>
      </VStack>
    </Box>
  );
}
