'use client';

import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 120, damping: 20 };

/** Animated h1 for hero title — springs in immediately on mount */
export function HeroTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0 }}
    >
      {children}
    </motion.h1>
  );
}

/** Animated p for hero subtitle — springs in after title */
export function HeroSubtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.15 }}
    >
      {children}
    </motion.p>
  );
}

/** Animated wrapper for hero CTA buttons — springs in last */
export function HeroCTA({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
