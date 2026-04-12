'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { navItems } from '@/data/settings';

/**
 * Sticky navigation bar.
 * - Hamburger toggle for mobile
 * - useScroll / useTransform for smooth scroll-shrink effect
 * - Back button hidden by default (matches original nav-back.js behaviour)
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { scrollY } = useScroll();
  const paddingY = useTransform(scrollY, [0, 60], ['0.75rem', '0.3rem']);
  const boxShadow = useTransform(
    scrollY,
    [0, 60],
    ['none', '0 2px 20px rgba(0,0,0,0.5)'],
  );

  return (
    <motion.nav
      className="navbar"
      aria-label="Primary navigation"
      style={{ paddingTop: paddingY, paddingBottom: paddingY, boxShadow }}
    >
      <div className="nav-container">
        <Link className="navbar-brand" href="/">
          <span className="brand-kieron">ebiya</span>
          <span className="brand-play">.SG</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="primary-nav"
          onClick={() => setIsOpen((o) => !o)}
        >
          <Image
            src="/assets/icon/menu.svg"
            alt=""
            className="icon"
            width={24}
            height={24}
            aria-hidden="true"
          />
        </button>

        <div
          className={`nav-links${isOpen ? ' nav-links--open' : ''}`}
          id="primary-nav"
        >
          {navItems.map((item) => (
            <Link
              key={item.url}
              className="nav-link"
              href={item.url}
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
