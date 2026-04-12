import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { FadeIn } from '@/components/motion/FadeIn';
import { ShrimpGallery } from '@/components/interactive/ShrimpGallery';

export const metadata: Metadata = {
  title: 'Premium Caridina Shrimp Gallery Singapore',
  description:
    'Explore our gallery of premium Caridina shrimp bred in Singapore: Taiwan Bee, Crystal Red (CRS), Crystal Black (CBS), Blue Bolt, King Kong, Panda, and Pinto varieties.',
  openGraph: {
    title: 'Premium Caridina Shrimp Gallery | ebiya.sg',
    description:
      'High-quality photos of Taiwan Bee, CRS, CBS, Blue Bolt, King Kong, Panda, and Pinto shrimp bred in Singapore by ebiya.sg.',
    url: 'https://ebiya.sg/shrimp',
  },
};

function getShrimpImages() {
  const optimizedDir = path.join(process.cwd(), 'public', 'assets', 'shrimps-optimized');
  if (!fs.existsSync(optimizedDir)) return [];

  const files = fs.readdirSync(optimizedDir);
  // Find all unique base names (e.g. "ebiya-logo") from -320.jpg files
  const baseNames = [...new Set(
    files
      .filter((f) => f.endsWith('-320.jpg'))
      .map((f) => f.replace(/-320\.jpg$/, ''))
  )];

  return baseNames.map((base) => ({
    src: `/assets/shrimps-optimized/${base}-320.jpg`,
    alt: `${base.replace(/-/g, ' ')} — Premium Caridina shrimp bred in Singapore by ebiya.sg`,
    name: base.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}

export default function ShrimpPage() {
  const images = getShrimpImages();

  return (
    <div className="page shrimp-page">
      <FadeIn className="gallery-header">
        <h1>Premium Caridina Shrimp Gallery</h1>
        <p className="gallery-subtitle">Singapore-bred Taiwan Bee, Crystal &amp; Specialty Shrimp</p>
        <p className="gallery-description">
          Professional macro photography showcasing premium Caridina shrimp varieties bred in
          Singapore. Features Taiwan Bee, Crystal Red/Black, Blue Bolt, King Kong, Panda, and rare
          Pinto shrimp from ebiya.sg&apos;s specialized breeding program.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <ShrimpGallery images={images} />
      </FadeIn>

      <FadeIn delay={0.2}>
        <section className="gallery-info">
          <h2>About Our Caridina Shrimp Collection</h2>
          <p>
            ebiya.sg specializes in breeding premium-grade Caridina shrimp in Singapore, including
            rare Taiwan Bee varieties, Crystal Red Shrimp (CRS), Crystal Black Shrimp (CBS), Blue
            Bolt, King Kong, Panda, and exclusive Pinto patterns. All shrimp are bred in
            custom-designed breeding tanks optimized for water parameters and genetics.
          </p>

          <h3>Featured Shrimp Varieties</h3>
          <ul>
            <li>
              <strong>Taiwan Bee Shrimp:</strong> King Kong, Panda, Blue Bolt premium grades
            </li>
            <li>
              <strong>Crystal Shrimp:</strong> Crystal Red (CRS) and Crystal Black (CBS) in SS–SSS grades
            </li>
            <li>
              <strong>Pinto Shrimp:</strong> Rare pattern variations with high coloration
            </li>
            <li>
              <strong>Specialty Varieties:</strong> Custom-bred lines exclusive to Singapore
            </li>
          </ul>

          <h3>Custom Breeding Tanks Available</h3>
          <p>
            Interested in starting your own Caridina breeding program? We offer custom shrimp tanks
            designed specifically for breeding sensitive Caridina species, with optimized filtration,
            substrate, and water parameter control systems.
          </p>
        </section>
      </FadeIn>
    </div>
  );
}
