'use client';

import { useEffect, useState } from 'react';

const TOTAL_SLOTS = 88;
const STORAGE_KEY = 'ebiyaSG_promo_slots';

function getStoredSlots(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return parseInt(stored, 10);
  } catch {
    // localStorage unavailable
  }
  return TOTAL_SLOTS;
}

function setStoredSlots(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    // localStorage unavailable
  }
}

export function MembershipCards() {
  const [slots, setSlots] = useState<number>(TOTAL_SLOTS);

  useEffect(() => {
    let current = getStoredSlots();
    // 10% chance per load to decrement (demo behavior)
    if (Math.random() < 0.1 && current > 50) {
      current--;
      setStoredSlots(current);
    }
    setSlots(current);
  }, []);

  const soldOut = slots <= 0;

  return (
    <div className="membership-plans">
      {/* Standard Plan */}
      <div className="plan-card standard-plan">
        <div className="plan-header">
          <div className="plan-badge">STANDARD</div>
          <h2 className="plan-name">Standard Membership</h2>
          <div className="plan-price">
            <span className="currency">SGD</span>
            <span className="amount">28</span>
            <span className="period">/ month</span>
          </div>
          <p className="plan-tagline">
            Perfect for hobbyists who want reliable guidance without long-term commitment
          </p>
        </div>

        <div className="plan-features">
          <h3>What You Get</h3>
          <ul className="feature-list">
            <li>Proven Caridina tank setup blueprint optimized for Singapore</li>
            <li>Exact water parameters for our tropical climate</li>
            <li>Step-by-step cycling guidance with timeline</li>
            <li>Ongoing tank maturity support as your tank ages</li>
            <li>Molting and survival troubleshooting</li>
            <li>Breeding and shrimplet survival basics</li>
            <li>Members-only guides and updates</li>
          </ul>
        </div>

        <div className="plan-footer">
          <p className="plan-note">Cancel anytime. Access continues until end of billing cycle.</p>
          <a
            href="https://buy.stripe.com/cNi7sD63e52i5D8b0kao800"
            className="cta-button standard-cta"
            data-plan="standard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join STANDARD Membership
          </a>
        </div>
      </div>

      {/* Gold Plan */}
      <div className="plan-card gold-plan featured-plan">
        <div className="featured-badge">MOST POPULAR</div>

        <div className="plan-header">
          <div className="plan-badge">GOLD</div>
          <h2 className="plan-name">Gold Membership</h2>

          <div className="promo-alert">
            <span className="promo-badge">LIMITED PROMO</span>
            <p className="promo-text">
              Only <strong id="slots-remaining">{slots}</strong> promo slots left
            </p>
          </div>

          <div className="plan-price promo-price">
            <div className="price-strikethrough">
              <span className="old-price">SGD 1,288</span>
            </div>
            <div className="current-price">
              <span className="currency">SGD</span>
              <span className="amount">888</span>
              <span className="period">/ year</span>
            </div>
            <p className="savings">Save SGD 400 (31% off)</p>
          </div>

          <p className="plan-tagline">
            Designed for serious collectors and breeders who want premium access and physical rewards
          </p>
        </div>

        <div className="limited-slots-info">
          <h3>Why Gold Membership Is Limited</h3>
          <ul>
            <li>Healthy shrimp distribution</li>
            <li>Fair access for all Gold members</li>
            <li>Consistent support quality</li>
            <li>Sustainable breeding practices</li>
          </ul>
        </div>

        <div className="plan-features">
          <h3>Everything in STANDARD, plus:</h3>

          <div className="premium-feature">
            <h4>Free Shrimp Allocation</h4>
            <ul className="feature-list">
              <li>10 pieces of Caridina shrimp</li>
              <li>Healthy, member-grade shrimp</li>
              <li>Provided after 30 days of active membership</li>
              <li>One allocation per paid membership year</li>
            </ul>
          </div>

          <div className="premium-feature">
            <h4>Elite Member Shrimp Pricing</h4>
            <ul className="feature-list">
              <li>Exclusive Gold-only prices</li>
              <li>Priority access to limited batches</li>
              <li>Better value for colony building</li>
            </ul>
          </div>

          <div className="premium-feature">
            <h4>Priority Support</h4>
            <ul className="feature-list">
              <li>Faster response time</li>
              <li>Priority troubleshooting</li>
              <li>&ldquo;Before you change anything&rdquo; guidance</li>
            </ul>
          </div>

          <div className="premium-feature">
            <h4>Early Access &amp; Reservations</h4>
            <ul className="feature-list">
              <li>Early access to new shrimp drops</li>
              <li>Priority reservation before public release</li>
            </ul>
          </div>
        </div>

        <div className="plan-footer">
          {soldOut ? (
            <button className="cta-button disabled-cta" disabled>
              Promo Sold Out
            </button>
          ) : (
            <a
              href="https://buy.stripe.com/3cI3cn3V652i3v0ecwao801"
              className="cta-button gold-cta promo-cta"
              data-plan="gold-promo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join GOLD — Promo SGD 888/year
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
