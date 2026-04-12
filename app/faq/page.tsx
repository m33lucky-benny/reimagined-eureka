import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { faqs } from '@/data/faqs';

export const metadata: Metadata = {
  title: 'Caridina Shrimp FAQ — Quick Help',
  description:
    'Answers to common questions about Caridina shrimp care, tank setup, water parameters, molting, and breeding in Singapore.',
  openGraph: {
    title: 'Caridina Shrimp FAQ | ebiya.sg',
    description:
      'Expert answers on Caridina shrimp care, tank setup, and breeding for Singapore conditions.',
    url: 'https://ebiya.sg/faq',
  },
};

export default function FaqPage() {
  return (
    <div className="page faq-page">
      <FadeIn>
        <h1>Quick Help — FAQ</h1>
        <p className="faq-intro">
          Common questions about Caridina shrimp care, tank setup, and keeping shrimp alive in
          Singapore. Can&apos;t find your answer?{' '}
          <a href="/contact">Contact us directly.</a>
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <FaqAccordion categories={faqs} />
      </FadeIn>
    </div>
  );
}
