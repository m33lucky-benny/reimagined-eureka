import { headers } from 'next/headers';

/**
 * Read the nonce injected by middleware.ts into the x-nonce request header.
 * Only callable in Server Components.
 */
export async function getNonce(): Promise<string> {
  const h = await headers();
  return h.get('x-nonce') ?? '';
}
