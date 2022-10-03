import { ReactNode } from 'react';
import {
  BoxProps,
  Flex,
  Heading,
  HStack,
  Tag,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

interface Props {
  cardTitle?: ReactNode;
  cardTag?: ReactNode;
  cardAction?: ReactNode;
}

export default function Card({
  children,
  cardTitle,
  cardTag,
  cardAction,
  ...props
}: BoxProps & Props) {
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
      {cardTitle && (
        <Flex
          minH="48px"
          w="full"
          maxW="100%"
          pb="16px"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack alignItems="center">
            {cardTag && <Tag>{cardTag}</Tag>}{' '}
            <Heading noOfLines={1}>{cardTitle}</Heading>
          </HStack>

          {cardAction}
        </Flex>
      )}

      {children}
    </VStack>
  );
}
