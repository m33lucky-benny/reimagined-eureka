import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata: Metadata = {
  title: 'Thank You',
  description: "Thank you for reaching out to ebiya.sg. We'll be in touch shortly.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <div className="page thank-you-page">
      <FadeIn className="thank-you-content">
        <h1>Thank You!</h1>
        <p>
          Your message has been received. We&apos;ll get back to you as soon as possible — usually
          within 1 business day.
        </p>
        <p>
          In the meantime, feel free to explore our{' '}
          <Link href="/faq">FAQ</Link>.
        </p>
        <Link className="button button--primary" href="/">
          Back to Home
        </Link>
      </FadeIn>
    </div>
  );
}
