import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerList, StaggerItem } from '@/components/motion/StaggerList';

export const metadata: Metadata = {
  title: 'About ebiyaSG – Singapore Caridina Shrimp Specialist & Custom Tank Builder',
  description:
    'Professional Caridina shrimp breeder in Singapore specializing in BOA, GALAXY, and BLUE KING KONG varieties. Custom breeding tanks designed for maximum shrimplet survival rates. Located near Old Airport Road, serving passionate shrimp keepers since 2018.',
  openGraph: {
    title: "About ebiyaSG – Singapore's Caridina Shrimp Breeding Specialist",
    description:
      'Professional Caridina breeder since 2018. Specializing in BOA, GALAXY, BLUE KING KONG. Custom breeding tanks engineered for shrimplet survival.',
    url: 'https://ebiya.sg/about',
  },
};

const varieties = [
  { icon: '🎯', name: 'BOA', desc: 'Bold, distinctive patterns with striking contrast' },
  { icon: '✨', name: 'GALAXY', desc: 'Striking celestial markings that shimmer under light' },
  { icon: '💙', name: 'BLUE KING KONG', desc: 'Vibrant blue coloration with excellent health' },
];

const tankOptions = [
  {
    name: '45×30cm Tank',
    badge: 'Starter',
    description:
      'Perfect for beginners learning Caridina fundamentals. Smaller volume, lower cooling costs, ideal for developing your technique.',
    features: ['33.75L water volume', '2.5–3L active soil', 'Single sponge filter', '12–25 shrimp stocking'],
    recommended: false,
  },
  {
    name: '60×30cm Tank',
    badge: 'Recommended',
    description:
      'Greater water volume means significantly more stable parameters — critical for breeding success and long-term shrimp health.',
    features: ['45L water volume', '6–8L active soil', 'UGF + sponge filter', '20–45 shrimp stocking'],
    recommended: true,
  },
];

const serviceMethods = [
  {
    icon: '🏪',
    name: 'In-Store Visit',
    badge: 'Primary',
    description: 'Visit us near Old Airport Road for a full consultation and hands-on product review.',
    items: ['Tank viewing by appointment', 'Water parameter testing', 'Equipment guidance'],
    primary: true,
  },
  {
    icon: '👑',
    name: 'VIP Gold Delivery',
    badge: 'VIP',
    description: 'Premium white-glove delivery and setup service for Gold members.',
    items: ['Full tank setup at your location', 'Live shrimp acclimatisation', 'Follow-up consultation'],
    vip: true,
  },
  {
    icon: '📦',
    name: 'Shipping',
    badge: 'Available',
    description: 'Carefully packed live shrimp and equipment delivered island-wide.',
    items: ['Live arrival guarantee', 'Express 24h delivery', 'Insulated packaging'],
  },
];

export default function AboutPage() {
  return (
    <div className="page">
      <FadeIn className="about-hero">
        <h1>About ebiya<span className="brand-sg">.SG</span></h1>
        <p className="hero-subtitle">
          Singapore-based Caridina shrimp specialist and custom tank builder dedicated to helping
          shrimp keepers <strong>succeed where others struggle</strong>.
        </p>
      </FadeIn>

      {/* Journey */}
      <FadeIn delay={0.1}>
        <section className="journey-section">
          <h2>From Hobby to Expertise</h2>
          <div className="journey-content">
            <div className="timeline-marker">
              <span className="year">2018</span>
              <span className="label">Started</span>
            </div>
            <p className="journey-text">
              What started as a personal passion in 2018 has evolved into a professional breeding
              operation built on <strong>years of hands-on experience</strong>. As a solo-run
              business partnered with a skilled tank-building team, ebiyaSG combines the precision
              of specialist breeding with the practical knowledge gained from countless trial-and-error cycles.
            </p>
            <p className="journey-text">
              Located conveniently <strong>near Old Airport Road Food Centre</strong>, the operation
              focuses on what truly matters: <strong>keeping shrimp alive and breeding consistently</strong>.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Offerings */}
      <section className="offerings-section">
        <FadeIn><h2>What We Offer</h2></FadeIn>

        {/* Shrimp varieties */}
        <FadeIn delay={0.1} className="offering-block">
          <h3>🦐 Premium Caridina Shrimp</h3>
          <p className="offering-intro">
            ebiyaSG specializes in high-grade Caridina varieties bred for <strong>health and stability</strong>:
          </p>
          <StaggerList className="shrimp-varieties">
            {varieties.map((v) => (
              <StaggerItem key={v.name} className="variety-card">
                <span className="variety-icon">{v.icon}</span>
                <h4>{v.name}</h4>
                <p>{v.desc}</p>
              </StaggerItem>
            ))}
          </StaggerList>
          <div className="quality-guarantee">
            <p>
              <strong>All shrimp are bred in-house</strong> using the same tank systems available
              to customers, ensuring proven performance under Singapore tropical conditions.
            </p>
          </div>
        </FadeIn>

        {/* Tank options */}
        <FadeIn delay={0.1} className="offering-block">
          <h3>🔧 Custom Breeding Tanks</h3>
          <p className="offering-intro">
            Two meticulously designed tank sizes engineered specifically to{' '}
            <strong>maximize shrimplet survival rates</strong>:
          </p>
          <StaggerList className="tank-options">
            {tankOptions.map((t) => (
              <StaggerItem key={t.name} className={`tank-option${t.recommended ? ' recommended' : ''}`}>
                {t.recommended && <span className="tank-badge">Recommended</span>}
                <h4>{t.name}</h4>
                <p className="tank-description">{t.description}</p>
                <ul className="tank-features">
                  {t.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </StaggerItem>
            ))}
          </StaggerList>
          <div className="tank-philosophy">
            <p>
              Every tank is built with <strong>Singapore&apos;s tropical climate in mind</strong>.{' '}
              <Link href="/tank-builder">Use the Tank Builder</Link> to find your ideal setup.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Service methods */}
      <section className="service-section">
        <FadeIn><h2>How We Work With You</h2></FadeIn>
        <StaggerList className="service-methods">
          {serviceMethods.map((s) => (
            <StaggerItem key={s.name} className={`service-card${s.primary ? ' primary-method' : ''}${s.vip ? ' vip-method' : ''}`}>
              <span className="service-icon">{s.icon}</span>
              <h3>{s.name}</h3>
              <span className="service-badge">{s.badge}</span>
              <p>{s.description}</p>
              <ul>
                {s.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p className="cta-intro">
            Whether you&apos;re a first-time keeper or expanding your operation, we have a solution
            that fits your goals and budget.
          </p>
          <div className="cta-buttons">
            <Link className="cta-button primary-cta" href="/tank-builder">
              Build My Tank Setup
            </Link>
            <Link className="cta-button secondary-cta" href="/shrimp">
              Browse Available Shrimp
            </Link>
            <Link className="cta-button gold-cta" href="/membership">
              View Gold Membership
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
