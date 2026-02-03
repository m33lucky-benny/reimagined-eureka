/**
 * FAQ Accordion Functionality
 * Custom Shrimp Tanks & Caridina Care FAQ - ebiya.sg
 * CSP-compliant: No inline event handlers or eval()
 */

(function () {
  "use strict";

  /**
   * Initialize FAQ accordion on DOM ready
   */
  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    if (!faqItems.length) {
      return; // No FAQ items found, exit early
    }

    // Attach click handlers to all FAQ items
    faqItems.forEach(function (item) {
      const button = item.querySelector(".faq-question");

      if (!button) {
        return; // Skip if button not found
      }

      button.addEventListener("click", function () {
        handleFAQClick(item, faqItems);
      });

      // Keyboard accessibility - Enter and Space
      button.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFAQClick(item, faqItems);
        }
      });
    });

    // Handle deep linking (URL hash)
    handleDeepLinking();

    // Handle browser back/forward with hash changes
    window.addEventListener("hashchange", handleDeepLinking);
  }

  /**
   * Handle FAQ item click/toggle
   * @param {HTMLElement} clickedItem - The FAQ item that was clicked
   * @param {NodeList} allItems - All FAQ items
   */
  function handleFAQClick(clickedItem, allItems) {
    const isActive = clickedItem.classList.contains("active");

    // Close all items
    closeAllFAQs(allItems);

    // Toggle current item (open if it was closed)
    if (!isActive) {
      openFAQ(clickedItem);
    }
  }

  /**
   * Close all FAQ items
   * @param {NodeList} items - All FAQ items to close
   */
  function closeAllFAQs(items) {
    items.forEach(function (item) {
      closeFAQ(item);
    });
  }

  /**
   * Open a specific FAQ item
   * @param {HTMLElement} item - The FAQ item to open
   */
  function openFAQ(item) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    item.classList.add("active");

    if (button) {
      button.setAttribute("aria-expanded", "true");
    }

    if (answer) {
      answer.setAttribute("aria-hidden", "false");
    }
  }

  /**
   * Close a specific FAQ item
   * @param {HTMLElement} item - The FAQ item to close
   */
  function closeFAQ(item) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    item.classList.remove("active");

    if (button) {
      button.setAttribute("aria-expanded", "false");
    }

    if (answer) {
      answer.setAttribute("aria-hidden", "true");
    }
  }

  /**
   * Handle deep linking - Open FAQ item based on URL hash
   */
  function handleDeepLinking() {
    const hash = window.location.hash;

    if (!hash) {
      return; // No hash in URL
    }

    try {
      const targetElement = document.querySelector(hash);

      // Check if target exists and is an FAQ item
      if (targetElement && targetElement.classList.contains("faq-item")) {
        // Close all first
        const allItems = document.querySelectorAll(".faq-item");
        closeAllFAQs(allItems);

        // Open the target
        openFAQ(targetElement);

        // Scroll to the item with a small delay for animation
        setTimeout(function () {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (error) {
      // Invalid selector in hash, fail silently
      console.warn("Invalid FAQ hash selector:", hash);
    }
  }

  /**
   * Enhanced accessibility - Add search/filter functionality
   * This is optional but helpful for large FAQ sections
   */
  function addFAQSearch() {
    const container = document.querySelector(".faq-container");

    if (!container) {
      return;
    }

    // Check if search input already exists
    if (document.getElementById("faq-search")) {
      return;
    }

    // Create search input
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "faq-search-wrapper";
    searchWrapper.innerHTML =
      '<label for="faq-search" class="faq-search-label">Search FAQs:</label>' +
      '<input type="search" id="faq-search" class="faq-search-input" ' +
      'placeholder="Type to filter questions..." aria-label="Search FAQ questions">';

    // Insert before first FAQ category
    const firstCategory = container.querySelector(".faq-category");
    if (firstCategory) {
      container.insertBefore(searchWrapper, firstCategory);
    }

    // Add search functionality
    const searchInput = document.getElementById("faq-search");
    if (searchInput) {
      searchInput.addEventListener("input", filterFAQs);
    }
  }

  /**
   * Filter FAQ items based on search input
   * @param {Event} e - Input event
   */
  function filterFAQs(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const faqItems = document.querySelectorAll(".faq-item");
    const categories = document.querySelectorAll(".faq-category");

    if (!searchTerm) {
      // Show all items and categories
      faqItems.forEach(function (item) {
        item.style.display = "";
      });
      categories.forEach(function (category) {
        category.style.display = "";
      });
      return;
    }

    // Filter items
    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!question) {
        return;
      }

      const questionText = question.textContent.toLowerCase();
      const answerText = answer ? answer.textContent.toLowerCase() : "";

      if (
        questionText.includes(searchTerm) ||
        answerText.includes(searchTerm)
      ) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });

    // Hide empty categories
    categories.forEach(function (category) {
      const visibleItems = category.querySelectorAll(
        '.faq-item:not([style*="display: none"])',
      );

      if (visibleItems.length === 0) {
        category.style.display = "none";
      } else {
        category.style.display = "";
      }
    });
  }

  /**
   * Initialize on DOM ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initFAQ();
      // Uncomment to enable search functionality:
      // addFAQSearch();
    });
  } else {
    // DOM already loaded
    initFAQ();
    // Uncomment to enable search functionality:
    // addFAQSearch();
  }
})();
