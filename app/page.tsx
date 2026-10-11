import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroTitle, HeroSubtitle, HeroCTA } from '@/components/motion/HeroEntrance';
import { FadeIn } from '@/components/motion/FadeIn';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Premium Caridina Shrimp Tank Systems & Breeding Racks Singapore',
  description:
    'Custom-built Caridina shrimp breeding tanks, professional rack systems, and RO water setups for Singapore. Engineered for stable water parameters and successful shrimp keeping.',
  openGraph: {
    title: 'Premium Caridina Shrimp Tank Systems Singapore | ebiya.sg',
    description:
      'Custom-built Caridina shrimp breeding tanks and rack systems. Nano to commercial breeding systems, engineered by shrimp breeders in Singapore.',
    url: 'https://ebiya.sg',
  },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Caridina Shrimp Tank Systems',
  description:
    'Custom-built shrimp breeding tanks and rack systems for Caridina and Neocaridina species in Singapore',
  brand: { '@type': 'Brand', name: 'ebiya.sg' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'SGD',
    availability: 'https://schema.org/InStock',
  },
  category: 'Aquarium Systems',
  manufacturer: {
    '@type': 'Organization',
    name: 'ebiya.sg',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SG',
      addressRegion: 'Singapore',
    },
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd id="product-schema" data={productSchema} />

      <div className="container hero-section">
        <HeroTitle className="hero-title">
          Caridina Shrimp Tank Systems Singapore
        </HeroTitle>

        <HeroSubtitle className="hero-subtitle">
          Premium shrimp breeding tanks and rack systems designed for stability,
          growth, and long-term success. From nano shrimp tanks to professional
          breeder rack systems — engineered by shrimp breeders in Singapore.
        </HeroSubtitle>

        <HeroCTA className="hero-cta-row">
          <Link
            className="btn btn-ghost"
            href="/shrimp"
            aria-label="View available live shrimp for sale"
          >
            Browse Live Shrimp
          </Link>
        </HeroCTA>

        <FadeIn delay={0.45} className="hero-seo-content">
          <p>
            ebiya.sg designs and builds professional shrimp tank systems for
            Caridina and Neocaridina breeders throughout Singapore. Our custom
            solutions include nano tanks, breeding rack systems, RO-based water
            filtration, and modular shrimp setups optimized for home hobbyists
            and commercial breeding operations.
          </p>
          <p>
            <strong>Specialized in:</strong> Crystal Red Shrimp (CRS), Taiwan
            Bee shrimp, Shadow Panda, Blue Bolt, and all Caridina species
            requiring precise water parameters and stable TDS control.
          </p>
        </FadeIn>
      </div>
    </>
  );
}
