import { ListItem, ListItemProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface Props {
  isSelected?: boolean;
  selectedBg?: string;
  selectedBorderColor?: string;
}

export default function MotionListItem({
  isSelected,
  selectedBg,
  selectedBorderColor,
  children,
  ...props
}: ListItemProps & Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <ListItem
        w="full"
        transition="0.15s background-color ease-in-out, 0.15s border-color ease-in-out"
        pr={2}
        cursor="pointer"
        borderLeft="4px solid transparent"
        {...props}
        {...(isSelected && {
          bg: selectedBg,
          borderColor: selectedBorderColor,
        })}
      >
        {children}
      </ListItem>
    </motion.div>
  );
}
