import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerList, StaggerItem } from '@/components/motion/StaggerList';
import { MembershipCards } from '@/components/interactive/MembershipCards';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Caridina Shrimp Membership Singapore — Expert Setup & Support',
  description:
    'Join ebiyaSG membership for proven Caridina shrimp tank systems optimized for Singapore. From SGD 28/month. Stop losing shrimp.',
  openGraph: {
    title: 'ebiyaSG Shrimp Membership — Build Caridina Tanks with Confidence',
    description:
      'Stop guessing and start succeeding with Caridina shrimp. Proven setup systems, ongoing support, exclusive benefits for Singapore conditions.',
    url: 'https://ebiya.sg/membership',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ebiyaSG Caridina Shrimp Care Membership',
  provider: { '@type': 'Organization', name: 'ebiya.sg', url: 'https://ebiya.sg' },
  areaServed: { '@type': 'Country', name: 'Singapore' },
  description:
    'Proven Caridina shrimp tank setup and care systems optimized for Singapore tropical conditions.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Standard Membership',
      price: '28',
      priceCurrency: 'SGD',
      billingDuration: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'Gold Membership (Promo)',
      price: '888',
      priceCurrency: 'SGD',
      billingDuration: 'P1Y',
    },
  ],
};

const problems = [
  { icon: '💀', title: 'Random Deaths', desc: 'Shrimp die "randomly" despite your best efforts' },
  { icon: '🔬', title: 'Failed Molts', desc: 'Molting failures even with "perfect" test results' },
  { icon: '🤔', title: 'Conflicting Advice', desc: 'Confusing information from forums and YouTube' },
  { icon: '💸', title: 'Endless Replacement', desc: 'Rebuying shrimp again and again' },
  { icon: '😰', title: 'Tank Fear', desc: 'Afraid to touch anything in your tank' },
  { icon: '🌡️', title: 'Climate Challenges', desc: "Singapore's heat and water making it harder" },
];

const solutions = [
  { title: 'Tank Setup That Works', desc: 'Proven blueprints for Singapore climate with proper cooling and filtration' },
  { title: 'Stable Water Parameters', desc: 'Exact pH, GH, KH, and TDS targets using Singapore water sources' },
  { title: 'Soil & Water Aging', desc: 'Understanding buffering capacity and when to intervene' },
  { title: 'Breeding Readiness', desc: 'Know when your tank is actually ready for reproduction' },
  { title: 'Problem Prevention', desc: 'Catch issues before they cause losses' },
  { title: 'Singapore-Specific Guidance', desc: 'Advice tailored for our tap water, temperature, and humidity' },
];

export default function MembershipPage() {
  return (
    <>
      <JsonLd id="service-schema" data={serviceSchema} />

      <div className="page membership-page">
        <FadeIn className="membership-hero">
          <h1>Build Your Caridina Shrimp Tank Right — The First Time</h1>
          <p className="hero-subtitle">
            Stop guessing. Stop losing shrimp.
            <br />
            The <strong>ebiyaSG Membership</strong> gives you a proven system to build and maintain{' '}
            <strong>stable, healthy Caridina shrimp tanks</strong>, designed specifically for{' '}
            <strong>Singapore tropical conditions</strong>.
          </p>
        </FadeIn>

        {/* Problem Section */}
        <FadeIn delay={0.1}>
          <section className="problem-section">
            <h2>Why Most Shrimp Keep Dying in Singapore</h2>
            <StaggerList className="problem-grid">
              {problems.map((p) => (
                <StaggerItem key={p.title} className="problem-item">
                  <span className="problem-icon">{p.icon}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </StaggerItem>
              ))}
            </StaggerList>
            <p className="problem-conclusion">
              The issue isn&apos;t your effort — it&apos;s{' '}
              <strong>lack of clear, consistent guidance optimized for Singapore conditions</strong>.
            </p>
          </section>
        </FadeIn>

        {/* Solution Section */}
        <FadeIn delay={0.1}>
          <section className="solution-section">
            <h2>What the ebiyaSG Membership Solves</h2>
            <StaggerList className="solution-grid">
              {solutions.map((s) => (
                <StaggerItem key={s.title} className="solution-item">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </StaggerItem>
              ))}
            </StaggerList>
          </section>
        </FadeIn>

        {/* Interactive Plan Cards (client component) */}
        <FadeIn delay={0.1}>
          <MembershipCards />
        </FadeIn>

        {/* Transparency */}
        <FadeIn delay={0.1}>
          <section className="transparency-section">
            <h2>Important Notes</h2>
            <ul className="transparency-list">
              <li>Membership benefits require an active subscription</li>
              <li>Shrimp selection is based on availability and current stock</li>
              <li>Physical shrimp perks are non-transferable between members</li>
              <li>Gold membership slots are limited to ensure quality</li>
              <li>Delivery or collection details arranged separately after activation</li>
              <li>All guidance is optimized for Singapore water parameters and climate</li>
            </ul>
          </section>
        </FadeIn>

        {/* Final CTA */}
        <FadeIn delay={0.1}>
          <section className="final-cta">
            <h2>Ready to Stop Guessing?</h2>
            <p className="final-message">
              Caridina shrimp aren&apos;t fragile.
              <br />
              They require <strong>precision, patience, and the right guidance</strong>.
            </p>
          </section>
        </FadeIn>
      </div>
    </>
  );
}
