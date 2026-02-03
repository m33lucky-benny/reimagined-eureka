/**
 * Hero Section Enhancement
 * Caridina Shrimp Tank Systems - ebiya.sg
 * CSP-compliant: No inline event handlers or eval()
 */

(function () {
  "use strict";

  /**
   * Configuration object
   */
  const config = {
    animationDelay: 100, // Delay before starting animations
    enableAnimations: true, // Can be toggled based on user preferences
    enableButtonEffects: true,
    enableIntersectionObserver: true, // For scroll-triggered animations
  };

  /**
   * Initialize hero section enhancements
   */
  function initHero() {
    const heroSection = document.querySelector(".hero-section");

    if (!heroSection) {
      return; // No hero section found, exit early
    }

    // Check user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      config.enableAnimations = false;
    }

    // Initialize animations
    if (config.enableAnimations) {
      initAnimations(heroSection);
    }

    // Initialize button interactions
    if (config.enableButtonEffects) {
      initButtonEffects();
    }

    // Initialize scroll reveal (optional)
    if (config.enableIntersectionObserver && "IntersectionObserver" in window) {
      initScrollReveal(heroSection);
    }

    // Initialize keyboard navigation enhancements
    initKeyboardNav();
  }

  /**
   * Initialize fade-in animations
   * @param {HTMLElement} heroSection - The hero section element
   */
  function initAnimations(heroSection) {
    // Add animation class after a short delay
    setTimeout(function () {
      heroSection.classList.add("animated");
    }, config.animationDelay);
  }

  /**
   * Initialize scroll-based reveal animations
   * @param {HTMLElement} heroSection - The hero section element
   */
  function initScrollReveal(heroSection) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            // Optional: Unobserve after animation triggers
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px", // Start slightly before element enters viewport
      },
    );

    observer.observe(heroSection);
  }

  /**
   * Initialize enhanced button effects
   */
  function initButtonEffects() {
    const buttons = document.querySelectorAll(".hero-cta-row .btn");

    buttons.forEach(function (button) {
      // Add ripple effect on click (optional enhancement)
      button.addEventListener("click", function (e) {
        createRipple(e, button);
      });

      // Track button clicks for analytics (if needed)
      button.addEventListener("click", function () {
        trackButtonClick(button);
      });
    });
  }

  /**
   * Create ripple effect on button click
   * @param {Event} event - Click event
   * @param {HTMLElement} button - Button element
   */
  function createRipple(event, button) {
    // Check if animations are disabled
    if (!config.enableAnimations) {
      return;
    }

    // Remove existing ripple if present
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create ripple element
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    // Calculate position
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Set ripple styles
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(function () {
      ripple.remove();
    }, 600);
  }

  /**
   * Track button clicks (placeholder for analytics)
   * @param {HTMLElement} button - Button element that was clicked
   */
  function trackButtonClick(button) {
    const buttonText = button.textContent.trim();
    const buttonHref = button.getAttribute("href");

    // Log to console (replace with actual analytics call)
    console.log("Button clicked:", {
      text: buttonText,
      href: buttonHref,
      timestamp: new Date().toISOString(),
    });

    // Example: Send to analytics service
    // if (window.gtag) {
    //   gtag('event', 'click', {
    //     event_category: 'CTA',
    //     event_label: buttonText,
    //     value: buttonHref
    //   });
    // }
  }

  /**
   * Initialize keyboard navigation enhancements
   */
  function initKeyboardNav() {
    const buttons = document.querySelectorAll(".hero-cta-row .btn");

    buttons.forEach(function (button, index) {
      button.addEventListener("keydown", function (e) {
        // Handle arrow key navigation between buttons
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const nextButton = buttons[index + 1];
          if (nextButton) {
            nextButton.focus();
          }
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const prevButton = buttons[index - 1];
          if (prevButton) {
            prevButton.focus();
          }
        }
      });
    });
  }

  /**
   * Handle visibility change (pause animations when tab is hidden)
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause animations
      document
        .querySelectorAll(".hero-section.animated")
        .forEach(function (section) {
          section.style.animationPlayState = "paused";
        });
    } else {
      // Page is visible, resume animations
      document
        .querySelectorAll(".hero-section.animated")
        .forEach(function (section) {
          section.style.animationPlayState = "running";
        });
    }
  }

  /**
   * Dynamically inject ripple CSS if not already present
   */
  function injectRippleStyles() {
    // Check if styles already exist
    if (document.getElementById("hero-ripple-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "hero-ripple-styles";
    style.textContent = `
      .btn {
        position: relative;
        overflow: hidden;
      }
      
      .btn .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .btn .ripple {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Initialize on DOM ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initHero();
      injectRippleStyles();
    });
  } else {
    // DOM already loaded
    initHero();
    injectRippleStyles();
  }

  // Handle visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Handle motion preference changes
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", function (e) {
      config.enableAnimations = !e.matches;

      if (!config.enableAnimations) {
        // Remove animated class if user enables reduced motion
        document.querySelectorAll(".hero-section").forEach(function (section) {
          section.classList.remove("animated");
        });
      }
    });
})();
