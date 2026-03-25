'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export function AnimatedContent({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 30,
}: AnimatedContentProps) {
  const getInitialY = () => {
    if (direction === 'up') return distance;
    if (direction === 'down') return -distance;
    return 0;
  };

  const getInitialX = () => {
    if (direction === 'left') return distance;
    if (direction === 'right') return -distance;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: getInitialY(), x: getInitialX() }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom bezier for smooth modern web feel
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
