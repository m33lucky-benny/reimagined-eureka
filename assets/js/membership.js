/**
 * Membership Page Interactive Functionality
 * Cloudflare CSP Compliant - No inline scripts
 * File: membership.js
 */

(function () {
  "use strict";

  /**
   * Configuration
   */
  const config = {
    totalPromoSlots: 88,
    storageKey: "ebiyaSG_promo_slots",
    updateInterval: 300000, // Update every 5 minutes (300000ms)
  };

  /**
   * Initialize membership page features
   */
  function initMembership() {
    // Update promo slots counter
    updatePromoSlotsCounter();

    // Track CTA clicks for analytics
    trackCTAClicks();

    // Add scroll-to-plan functionality
    initScrollToPlan();

    // Highlight featured plan on scroll
    initPlanHighlight();

    // Set up periodic updates
    setInterval(updatePromoSlotsCounter, config.updateInterval);
  }

  /**
   * Update promotional slots remaining counter
   * In production, this would fetch from your backend API
   */
  function updatePromoSlotsCounter() {
    const slotsElement = document.getElementById("slots-remaining");

    if (!slotsElement) return;

    // For demo purposes, decrement slowly from localStorage
    // In production, replace with actual API call to your backend
    let currentSlots = getStoredSlots();

    // Simulate slow decrease (for demo)
    const randomDecrease = Math.random() < 0.1; // 10% chance on each check
    if (randomDecrease && currentSlots > 50) {
      currentSlots--;
      setStoredSlots(currentSlots);
    }

    // Update display
    slotsElement.textContent = currentSlots;

    // Add urgency styling when low
    if (currentSlots <= 20) {
      slotsElement.style.color = "#ff006e";
      slotsElement.style.fontWeight = "900";
    }

    // Disable Gold promo button when sold out
    if (currentSlots <= 0) {
      disablePromoButtons();
    }
  }

  /**
   * Get stored promo slots from localStorage
   */
  function getStoredSlots() {
    try {
      const stored = localStorage.getItem(config.storageKey);
      if (stored) {
        return parseInt(stored, 10);
      }
    } catch (e) {
      console.log("localStorage not available");
    }
    return config.totalPromoSlots;
  }

  /**
   * Store promo slots in localStorage
   */
  function setStoredSlots(slots) {
    try {
      localStorage.setItem(config.storageKey, slots.toString());
    } catch (e) {
      console.log("localStorage not available");
    }
  }

  /**
   * Disable promo buttons when sold out
   */
  function disablePromoButtons() {
    const promoButtons = document.querySelectorAll('[data-plan="gold-promo"]');

    promoButtons.forEach(function (button) {
      button.classList.add("disabled-cta");
      button.textContent = "🔒 Promo Sold Out";
      button.style.pointerEvents = "none";

      // Update href to regular price link
      const regularLink = "https://buy.stripe.com/cNi6oz4ZabqGe9E5G0ao802";
      button.setAttribute("href", regularLink);
    });

    // Show sold out message
    const promoBadges = document.querySelectorAll(".promo-badge");
    promoBadges.forEach(function (badge) {
      badge.textContent = "🔒 PROMO SOLD OUT";
      badge.style.background = "#555555";
    });
  }

  /**
   * Track CTA button clicks for analytics
   */
  function trackCTAClicks() {
    const ctaButtons = document.querySelectorAll(".cta-button[data-plan]");

    ctaButtons.forEach(function (button) {
      button.addEventListener("click", function (e) {
        const planType = button.getAttribute("data-plan");

        // Track with Google Analytics if available
        if (typeof gtag === "function") {
          gtag("event", "membership_cta_click", {
            event_category: "Membership",
            event_label: planType,
            value: planType === "gold-promo" ? 888 : 28,
          });
        }

        // Track with Facebook Pixel if available
        if (typeof fbq === "function") {
          fbq("track", "InitiateCheckout", {
            content_name: "ebiyaSG Membership - " + planType,
            value: planType === "gold-promo" ? 888 : 28,
            currency: "SGD",
          });
        }

        // Console log for debugging
        console.log("Membership CTA clicked:", planType);
      });
    });
  }

  /**
   * Smooth scroll to plan section from anchor links
   */
  function initScrollToPlan() {
    // Handle hash links in URL
    if (window.location.hash) {
      const hash = window.location.hash;
      if (hash === "#standard" || hash === "#gold") {
        setTimeout(function () {
          const planSection = document.querySelector(".membership-plans");
          if (planSection) {
            planSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    }
  }

  /**
   * Highlight featured plan when it comes into view
   */
  function initPlanHighlight() {
    const goldPlan = document.querySelector(".gold-plan");

    if (!goldPlan) return;

    // Use Intersection Observer for performance
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Add pulse animation when plan becomes visible
            goldPlan.style.animation = "none";
            setTimeout(function () {
              goldPlan.style.animation = "";
            }, 10);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      },
    );

    observer.observe(goldPlan);
  }

  /**
   * Add keyboard navigation for plan cards
   */
  function initKeyboardNavigation() {
    const planCards = document.querySelectorAll(
      ".plan-card:not(.disabled-plan)",
    );

    planCards.forEach(function (card) {
      // Make cards focusable
      card.setAttribute("tabindex", "0");

      // Add keyboard handler
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          // Find CTA button within card and click it
          const ctaButton = card.querySelector(".cta-button");
          if (ctaButton && !ctaButton.disabled) {
            ctaButton.click();
          }
        }
      });
    });
  }

  /**
   * Add countdown timer for promo (optional enhancement)
   */
  function initPromoCountdown() {
    const promoEndDate = new Date("2026-03-31T23:59:59+08:00"); // Singapore time
    const countdownElements = document.querySelectorAll("[data-countdown]");

    if (countdownElements.length === 0) return;

    function updateCountdown() {
      const now = new Date();
      const diff = promoEndDate - now;

      if (diff <= 0) {
        // Promo ended
        countdownElements.forEach(function (el) {
          el.textContent = "Promo Ended";
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      countdownElements.forEach(function (el) {
        el.textContent = days + "d " + hours + "h remaining";
      });
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
  }

  /**
   * Show comparison tooltip on hover (optional enhancement)
   */
  function initPlanComparison() {
    const planCards = document.querySelectorAll(".plan-card");

    planCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        // Could show quick comparison tooltip
        // Implementation depends on your design needs
      });
    });
  }

  /**
   * Initialize all features when DOM is ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initMembership();
      initKeyboardNavigation();
      // Uncomment these if you want additional features:
      // initPromoCountdown();
      // initPlanComparison();
    });
  } else {
    // DOM already loaded
    initMembership();
    initKeyboardNavigation();
  }

  /**
   * Handle page visibility changes
   * Update slots counter when user returns to page
   */
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      updatePromoSlotsCounter();
    }
  });
})();
