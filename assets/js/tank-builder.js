/**
 * Tank Builder Interactive Functionality
 * Cloudflare CSP Compliant - No inline scripts
 * File: tank-builder.js
 */

(function () {
  "use strict";

  /**
   * Tank configuration data
   */
  const tankConfigs = {
    45: {
      soil: "2.5–3 liters of active shrimp soil (e.g., ADA Amazonia, Netlea, UNS Controsoil). Use a thin slope toward the front. Do NOT rinse the soil—it needs to release buffering compounds. This smaller volume requires careful substrate choice to maintain stable pH levels.",
      filter:
        "Single sponge filter or low-flow hang-on-back (HOB) filter with pre-filter sponge. Avoid strong currents that can stress shrimp or disturb the biofilm. Consider using a small air pump with flow control valve for gentle water movement.",
      chimney:
        "Optional: Maximum 1 UGF chimney with gentle airflow. Use only if you understand undergravel filtration principles. Too much flow will destabilize your parameters in smaller volumes. Many successful keepers skip UGF entirely in 45cm tanks.",
      reason:
        "Smaller water volumes (33.75L) react faster to parameter changes, making them more challenging for beginners. However, this also means lower cooling costs in Singapore. Simplicity is key—minimal equipment, lower stocking density, and consistent maintenance prevent crashes. This size teaches you the fundamentals before scaling up.",
      maintenance:
        "Perform 10% weekly water changes using remineralized RO water only (never tap water). Feed very lightly—shrimp primarily graze on biofilm. Remove any leftover food within 2 hours. Monitor TDS daily for the first month, then 2-3 times weekly once stable. Keep detailed logs of parameters.",
    },
    60: {
      soil: "6–8 liters of active shrimp soil for extended buffering capacity and longer soil life (12+ months). Create a gentle slope with deeper substrate at the back. This larger volume allows for more beneficial bacteria colonization and better nutrient processing in the substrate.",
      filter:
        "Undergravel filter (UGF) combined with sponge filter, OR canister filter with intake pre-filter sponge to protect shrimplets. The UGF creates excellent water circulation through the substrate, promoting beneficial bacteria growth. Ensure all equipment is shrimp-safe (no strong suction points).",
      chimney:
        "1 UGF chimney is standard for this tank size. You may add a 2nd chimney only for higher stocking levels (35+ shrimp), but maintain gentle airflow. Over-aeration can cause pH swings. Use quality air pumps with adjustable valves for precise flow control.",
      reason:
        "Greater water volume (45L) equals significantly more stable pH, TDS, and temperature parameters—critical for breeding success. This size provides better buffering against mistakes and environmental fluctuations. The increased water volume also supports a more robust beneficial bacteria colony, leading to better waste processing and higher survival rates for shrimplets.",
      maintenance:
        "Perform 10% weekly water changes using only remineralized RO water matched to your tank's current TDS (±10 ppm). Never use Singapore tap water—it has unsuitable TDS and pH for Caridina. Test parameters 2-3 times weekly. During breeding season, you may increase water changes to 15% if TDS creeps above 130 ppm. Keep a maintenance log to identify patterns.",
    },
  };

  /**
   * Initialize the tank builder when DOM is ready
   */
  function initTankBuilder() {
    const cards = document.querySelectorAll(".tank-card");
    const buildSection = document.getElementById("build");

    // Element references for build output
    const soilElement = document.getElementById("soil");
    const filterElement = document.getElementById("filter");
    const chimneyElement = document.getElementById("chimney");
    const reasonElement = document.getElementById("reason");
    const maintenanceElement = document.getElementById("maintenance");

    // Validate required elements exist
    if (
      !buildSection ||
      !soilElement ||
      !filterElement ||
      !chimneyElement ||
      !reasonElement ||
      !maintenanceElement
    ) {
      console.error("Tank Builder: Required DOM elements not found");
      return;
    }

    // Add click handlers to tank cards
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        handleTankSelection(card, cards, buildSection, {
          soil: soilElement,
          filter: filterElement,
          chimney: chimneyElement,
          reason: reasonElement,
          maintenance: maintenanceElement,
        });
      });

      // Add keyboard support for accessibility
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-pressed", "false");

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTankSelection(card, cards, buildSection, {
            soil: soilElement,
            filter: filterElement,
            chimney: chimneyElement,
            reason: reasonElement,
            maintenance: maintenanceElement,
          });
        }
      });
    });
  }

  /**
   * Handle tank card selection
   */
  function handleTankSelection(selectedCard, allCards, buildSection, elements) {
    const tankSize = selectedCard.getAttribute("data-size");

    // Remove selected state from all cards
    allCards.forEach(function (card) {
      card.classList.remove("selected");
      card.setAttribute("aria-pressed", "false");
    });

    // Add selected state to clicked card
    selectedCard.classList.add("selected");
    selectedCard.setAttribute("aria-pressed", "true");

    // Show build section
    buildSection.classList.add("active");

    // Update content based on tank size
    const config = tankConfigs[tankSize];
    if (config) {
      elements.soil.textContent = config.soil;
      elements.filter.textContent = config.filter;
      elements.chimney.textContent = config.chimney;
      elements.reason.textContent = config.reason;
      elements.maintenance.textContent = config.maintenance;
    }

    // Smooth scroll to build section
    setTimeout(function () {
      buildSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    // Track analytics if available (optional)
    if (typeof gtag === "function") {
      gtag("event", "tank_size_selected", {
        event_category: "Tank Builder",
        event_label: tankSize + "cm",
        value: tankSize,
      });
    }
  }

  /**
   * Add membership CTA highlight on scroll (optional enhancement)
   */
  function initCTAHighlight() {
    const buildSection = document.getElementById("build");
    const membershipCTA = document.querySelector(".membership-cta");

    if (!buildSection || !membershipCTA) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Highlight CTA after user has viewed build recommendations
            setTimeout(function () {
              membershipCTA.classList.add("highlight");
            }, 2000);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(buildSection);
  }

  /**
   * Initialize all features when DOM is ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTankBuilder();
      initCTAHighlight();
    });
  } else {
    // DOM already loaded
    initTankBuilder();
    initCTAHighlight();
  }
})();
