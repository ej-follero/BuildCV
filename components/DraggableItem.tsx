'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface DraggableItemProps {
  id: string;
  index: number;
  children: ReactNode;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function DraggableItem({ id, index, children, isDragging, dragHandleProps }: DraggableItemProps) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        scale: isDragging ? 1.02 : 1,
        opacity: isDragging ? 0.8 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className="relative"
    >
      <div
        {...dragHandleProps}
        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="pl-10">
        {children}
      </div>
    </motion.div>
  );
}
