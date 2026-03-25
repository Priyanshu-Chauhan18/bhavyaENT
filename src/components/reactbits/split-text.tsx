'use client';

import { motion, Variants } from 'framer-motion';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function SplitText({ children, className = '', delay = 0 }: SplitTextProps) {
  const words = children.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.12, 
        delayChildren: delay * 0.1,
      },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} style={{ paddingBottom: '0.1em' }}>
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
