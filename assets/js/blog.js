/**
 * blog-index.js
 * Progressive enhancement for ebiya.sg blog index
 * CSP-compliant: No inline scripts, event handlers, or eval()
 */

(function () {
  "use strict";

  // ======================================================
  // DOM Ready Check
  // ======================================================

  function domReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  // ======================================================
  // Search/Filter Functionality (Progressive Enhancement)
  // ======================================================

  function initBlogSearch() {
    const blogList = document.querySelector(".blog-list");
    if (!blogList) return;

    // Create search input (only if JS is enabled)
    const searchContainer = document.createElement("div");
    searchContainer.className = "blog-search";
    searchContainer.innerHTML = `
      <label for="blog-search-input" class="sr-only">Search articles</label>
      <input 
        type="search" 
        id="blog-search-input" 
        class="blog-search-input" 
        placeholder="Search shrimp guides..."
        aria-label="Search blog articles"
      />
    `;

    const blogHeader = document.querySelector(".blog-header");
    if (blogHeader) {
      blogHeader.appendChild(searchContainer);
    }

    const searchInput = document.getElementById("blog-search-input");
    const postCards = Array.from(document.querySelectorAll(".post-card"));

    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase().trim();

      postCards.forEach(function (card) {
        const title =
          card.querySelector(".post-title")?.textContent.toLowerCase() || "";
        const excerpt =
          card.querySelector(".post-excerpt")?.textContent.toLowerCase() || "";
        const categories =
          card.querySelector(".post-categories")?.textContent.toLowerCase() ||
          "";

        const matches =
          title.includes(searchTerm) ||
          excerpt.includes(searchTerm) ||
          categories.includes(searchTerm);

        if (matches) {
          card.style.display = "";
          card.removeAttribute("aria-hidden");
        } else {
          card.style.display = "none";
          card.setAttribute("aria-hidden", "true");
        }
      });

      // Show "no results" message
      const visibleCards = postCards.filter(
        (card) => card.style.display !== "none",
      );
      updateNoResultsMessage(visibleCards.length === 0, blogList);
    });
  }

  // ======================================================
  // No Results Message
  // ======================================================

  function updateNoResultsMessage(show, container) {
    let noResults = document.getElementById("no-results-message");

    if (show && !noResults) {
      noResults = document.createElement("div");
      noResults.id = "no-results-message";
      noResults.className = "no-results";
      noResults.textContent =
        "No articles found. Try different keywords or browse all guides.";
      noResults.setAttribute("role", "status");
      noResults.setAttribute("aria-live", "polite");
      container.appendChild(noResults);
    } else if (!show && noResults) {
      noResults.remove();
    }
  }

  // ======================================================
  // Reading Time Estimator
  // ======================================================

  function addReadingTime() {
    const postCards = document.querySelectorAll(".post-card");

    postCards.forEach(function (card) {
      const excerpt = card.querySelector(".post-excerpt");
      if (!excerpt) return;

      const text = excerpt.textContent;
      const words = text.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / 200); // Average reading speed

      const meta = card.querySelector(".post-meta");
      if (meta && readingTime > 0) {
        const timeSpan = document.createElement("span");
        timeSpan.className = "reading-time";
        timeSpan.textContent = `${readingTime} min read`;
        timeSpan.setAttribute(
          "aria-label",
          `Estimated ${readingTime} minute read`,
        );
        meta.appendChild(timeSpan);
      }
    });
  }

  // ======================================================
  // Lazy Load Animation (Intersection Observer)
  // ======================================================

  function initLazyAnimation() {
    if (!("IntersectionObserver" in window)) return;

    const postCards = document.querySelectorAll(".post-card");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    postCards.forEach(function (card) {
      card.classList.add("fade-in-card");
      observer.observe(card);
    });
  }

  // ======================================================
  // Category Filter Toggle
  // ======================================================

  function initCategoryFilter() {
    const categories = document.querySelectorAll(".category");
    if (categories.length === 0) return;

    categories.forEach(function (category) {
      category.style.cursor = "pointer";
      category.setAttribute("role", "button");
      category.setAttribute("tabindex", "0");

      category.addEventListener("click", handleCategoryClick);
      category.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCategoryClick.call(this, e);
        }
      });
    });
  }

  function handleCategoryClick(e) {
    const categoryName = this.textContent.trim().toLowerCase();
    const allCards = document.querySelectorAll(".post-card");

    allCards.forEach(function (card) {
      const cardCategories = card.querySelector(".post-categories");
      if (!cardCategories) return;

      const hasCategory = cardCategories.textContent
        .toLowerCase()
        .includes(categoryName);

      if (hasCategory) {
        card.style.display = "";
        card.classList.add("highlight-card");
        setTimeout(function () {
          card.classList.remove("highlight-card");
        }, 2000);
      }
    });
  }

  // ======================================================
  // Keyboard Navigation Enhancement
  // ======================================================

  function enhanceKeyboardNav() {
    const postLinks = document.querySelectorAll(".post-link, .read-more");

    postLinks.forEach(function (link) {
      link.addEventListener("keydown", function (e) {
        // Allow users to activate with Space in addition to Enter
        if (e.key === " ") {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // ======================================================
  // Initialize All Features
  // ======================================================

  domReady(function () {
    initBlogSearch();
    addReadingTime();
    initLazyAnimation();
    initCategoryFilter();
    enhanceKeyboardNav();

    // Log initialization for debugging (remove in production)
    if (console && console.log) {
      console.log("ebiya.sg blog index enhanced");
    }
  });
})();
