import { ReactNode } from 'react';
import {
  Box,
  BoxProps,
  Heading,
  HStack,
  Tag,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

interface Props {
  cardTitle?: ReactNode;
  cardTag?: ReactNode;
}

export default function Card({
  children,
  cardTitle,
  cardTag,
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
        <HStack minH="48px" maxW="100%" pb="16px">
          {cardTag && <Tag>{cardTag}</Tag>}{' '}
          <Heading noOfLines={1}>{cardTitle}</Heading>
        </HStack>
      )}

      {children}
    </VStack>
  );
}
