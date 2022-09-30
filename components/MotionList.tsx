import { List, ListProps } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { ForwardedRef, forwardRef } from 'react';

const MotionList = forwardRef(function MotionList(
  { children, ...props }: ListProps,
  ref: ForwardedRef<HTMLUListElement>,
) {
  return (
    <List {...props} ref={ref}>
      <AnimatePresence>{children}</AnimatePresence>
    </List>
  );
});

export default MotionList;
