'use client';

import { MotionConfig } from 'framer-motion';

interface MotionProviderProps {
  nonce: string;
  children: React.ReactNode;
}

/**
 * Passes the CSP nonce from the server layout to Framer Motion's internal
 * style injection, so injected <style> tags carry nonce="..." and pass
 * the style-src 'nonce-...' CSP directive.
 */
export function MotionProvider({ nonce, children }: MotionProviderProps) {
  return <MotionConfig nonce={nonce}>{children}</MotionConfig>;
}
