import { List, ListProps } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

export default function MotionList({ children, ...props }: ListProps) {
  return (
    <List {...props}>
      <AnimatePresence>{children}</AnimatePresence>
    </List>
  );
}
