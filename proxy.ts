import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function proxy(request: NextRequest) {
  const nonce = crypto.randomBytes(16).toString('base64');

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `font-src 'self'`, // next/font self-hosts Montserrat — no external CDN needed
    `img-src 'self' data: blob:`,
    `connect-src 'self'`,
    `form-action https://docs.google.com 'self'`,
    `frame-src https://docs.google.com`,
    `base-uri 'self'`,
    `object-src 'none'`,
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const proxyConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
};
