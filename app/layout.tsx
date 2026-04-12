import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { getNonce } from '@/lib/cspNonce';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { PageTransition } from '@/components/motion/PageTransition';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import '@/styles/globals.scss';

// Self-hosted via next/font — no fonts.googleapis.com request, no external font-src in CSP
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ebiya.sg',
    template: '%s | Ebiya.sg',
  },
  description:
    "Singapore's premier Caridina shrimp specialist — custom tank systems, premium shrimp, and expert guidance.",
  metadataBase: new URL('https://ebiya.sg'),
  openGraph: {
    siteName: 'Ebiya.sg',
    locale: 'en_SG',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = await getNonce();

  return (
    <html lang="en" className={montserrat.variable}>
      <body className="site-body">
        {/* MotionProvider passes the CSP nonce to Framer Motion's style injection */}
        <MotionProvider nonce={nonce}>
          <Navbar />
          <PageTransition>
            <main id="content" className="site-main">
              {children}
            </main>
          </PageTransition>
          <Footer />
          <WhatsAppFloat />
        </MotionProvider>
      </body>
    </html>
  );
}
