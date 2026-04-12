import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { TankBuilder } from '@/components/interactive/TankBuilder';

export const metadata: Metadata = {
  title: 'Tank Builder — Design Your Caridina Shrimp Setup',
  description:
    'Select your tank size and get a complete blueprint: substrate, filtration, UGF setup, and maintenance routine tailored for Caridina shrimp in Singapore.',
  openGraph: {
    title: 'Caridina Shrimp Tank Builder | ebiya.sg',
    description:
      'Interactive tank builder for Caridina shrimp keepers in Singapore. Choose 45cm or 60cm and get a custom setup blueprint.',
    url: 'https://ebiya.sg/tank-builder',
  },
};

export default function TankBuilderPage() {
  return (
    <div className="page tank-builder-page">
      <FadeIn>
        <h1>Tank Builder</h1>
        <p className="tank-builder-intro">
          Select your tank size to get a complete, Singapore-optimized setup blueprint — substrate,
          filtration, UGF configuration, and maintenance routine.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <TankBuilder />
      </FadeIn>
    </div>
  );
}
