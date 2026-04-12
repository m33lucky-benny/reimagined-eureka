'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { tankConfigs } from '@/data/tankConfig';

type TankSize = '45' | '60';

const tanks: { size: TankSize; label: string; volume: string; badge?: string }[] = [
  { size: '45', label: '45×30cm Tank', volume: '33.75L', badge: 'Starter' },
  { size: '60', label: '60×30cm Tank', volume: '45L', badge: 'Recommended' },
];

export function TankBuilder() {
  const [selected, setSelected] = useState<TankSize | null>(null);

  const config = selected ? tankConfigs[selected] : null;

  return (
    <>
      <div className="tank-cards" role="group" aria-label="Select tank size">
        {tanks.map((t) => (
          <button
            key={t.size}
            className={`tank-card${selected === t.size ? ' selected' : ''}`}
            aria-pressed={selected === t.size}
            onClick={() => setSelected(t.size)}
          >
            {t.badge && <span className="tank-card-badge">{t.badge}</span>}
            <h3>{t.label}</h3>
            <p className="tank-card-volume">{t.volume} water volume</p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {config && selected && (
          <motion.section
            id="build"
            className="build-result active"
            key={selected}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2>Your {selected}cm Tank Blueprint</h2>

            <div className="build-item">
              <h3>Substrate / Soil</h3>
              <p id="soil">{config.soil}</p>
            </div>

            <div className="build-item">
              <h3>Filtration</h3>
              <p id="filter">{config.filter}</p>
            </div>

            <div className="build-item">
              <h3>UGF Chimney</h3>
              <p id="chimney">{config.chimney}</p>
            </div>

            <div className="build-item build-item--highlight">
              <h3>Why This Size?</h3>
              <p id="reason">{config.reason}</p>
            </div>

            <div className="build-item">
              <h3>Maintenance Routine</h3>
              <p id="maintenance">{config.maintenance}</p>
            </div>

            <div className="membership-cta">
              <p>Want hands-on guidance setting up your tank?</p>
              <Link href="/membership" className="button button--primary">
                View Membership Plans
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
