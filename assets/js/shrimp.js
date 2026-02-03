/**
 * Shrimp Gallery Lightbox
 * CSP-compliant external script for ebiya.sg shrimp gallery
 * No inline event handlers - uses event delegation
 */

(function () {
  "use strict";

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGallery);
  } else {
    initGallery();
  }

  function initGallery() {
    const lightbox = document.getElementById("shrimpLightbox");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");

    // Exit if elements don't exist
    if (!lightbox || !lightboxImg) {
      return;
    }

    // Event delegation for gallery items
    document.addEventListener("click", handleClick);

    // Keyboard support
    document.addEventListener("keydown", handleKeydown);

    /**
     * Handle all click events
     */
    function handleClick(event) {
      const target = event.target;

      // Check if clicked on shrimp thumbnail
      if (target.matches(".shrimp-item img")) {
        event.preventDefault();
        openLightbox(target);
        return;
      }

      // Check if clicked on close button or lightbox background
      if (
        target === lightbox ||
        target === lightboxClose ||
        target.closest(".lightbox-close")
      ) {
        event.preventDefault();
        closeLightbox();
        return;
      }
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(event) {
      if (!lightbox.classList.contains("open")) {
        return;
      }

      // Close on Escape key
      if (event.key === "Escape" || event.key === "Esc") {
        event.preventDefault();
        closeLightbox();
      }
    }

    /**
     * Open lightbox with image
     */
    function openLightbox(imgElement) {
      const figure = imgElement.closest(".shrimp-item");
      const fullSrc = figure ? figure.dataset.fullSrc : null;
      const altText = imgElement.alt;

      // Use full resolution if available, otherwise use current src
      lightboxImg.src = fullSrc || imgElement.src;
      lightboxImg.alt = altText;

      lightbox.classList.add("open");

      // Prevent body scroll when lightbox is open
      document.body.style.overflow = "hidden";

      // Focus management for accessibility
      if (lightboxClose) {
        lightboxClose.focus();
      }

      // Announce to screen readers
      announceToScreenReader("Image viewer opened. Press Escape to close.");
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
      lightbox.classList.remove("open");

      // Restore body scroll
      document.body.style.overflow = "";

      // Clear image src to free memory
      setTimeout(() => {
        if (!lightbox.classList.contains("open")) {
          lightboxImg.src = "";
        }
      }, 300);

      // Announce to screen readers
      announceToScreenReader("Image viewer closed.");
    }

    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.className = "sr-only";
      announcement.textContent = message;

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }

    /**
     * Lazy loading observer (progressive enhancement)
     */
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;

              // Load high-res version on hover/view
              const figure = img.closest(".shrimp-item");
              if (figure && figure.dataset.fullSrc && !img.dataset.fullLoaded) {
                const highResImg = new Image();
                highResImg.src = figure.dataset.fullSrc;
                img.dataset.fullLoaded = "true";
              }

              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px",
        },
      );

      // Observe all gallery images
      document.querySelectorAll(".shrimp-item img").forEach((img) => {
        imageObserver.observe(img);
      });
    }

    /**
     * Performance optimization - preload images on hover
     */
    document.addEventListener(
      "mouseover",
      (event) => {
        if (event.target.matches(".shrimp-item img")) {
          const figure = event.target.closest(".shrimp-item");
          if (figure && figure.dataset.fullSrc && !figure.dataset.preloaded) {
            const preloadLink = document.createElement("link");
            preloadLink.rel = "prefetch";
            preloadLink.href = figure.dataset.fullSrc;
            document.head.appendChild(preloadLink);
            figure.dataset.preloaded = "true";
          }
        }
      },
      { passive: true },
    );
  }

  /**
   * Add screen reader only class via CSS
   * This should be in your main CSS, but included here as reference
   */
  if (!document.querySelector("style[data-sr-only]")) {
    const srStyle = document.createElement("style");
    srStyle.dataset.srOnly = "true";
    srStyle.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(srStyle);
  }
})();
