import { ListItem, ListItemProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export default function MotionListItem({ children, ...props }: ListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <ListItem {...props}>{children}</ListItem>
    </motion.div>
  );
}
