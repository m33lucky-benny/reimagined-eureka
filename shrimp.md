---
layout: page
title: "Shrimp Bred in Singapore: Fancy Red Tigers, Blue King Kong, White Spectra"
tagline: "Caridina shrimp bred in Singapore, plus Neocaridina"
description: "Caridina shrimp bred in Singapore: fancy red tigers, blue king kong, white spectra and orange boa, plus Neocaridina. Prices from S$40 each. Collection by appointment."
permalink: /shrimp/
tags:
  - caridina-shrimp-singapore
  - fancy-red-tiger-shrimp
  - blue-king-kong-shrimp
  - white-spectra-shrimp
  - orange-boa-shrimp
  - neocaridina-singapore
keywords:
  - caridina shrimp singapore
  - fancy red tiger shrimp
  - blue king kong shrimp
  - white spectra shrimp
  - orange boa shrimp
  - neocaridina singapore
  - ebiya singapore
excerpt: "Caridina shrimp bred in Singapore by ebiya.sg: fancy red tigers, blue king kong, white spectra and orange boa, plus Neocaridina. Prices are per piece. Collection at 55 Changi Road by appointment."
schema_type: ImageGallery
---

<section class="shrimp-gallery-page">
  <div class="gallery-header">
    <h1 class="gallery-title">Our Shrimp</h1>
    <p class="gallery-subtitle">Caridina shrimp bred in Singapore, plus Neocaridina</p>
    <p class="gallery-description">{{ page.excerpt }}</p>
  </div>
{%- comment -%}
{% include share-buttons.html %}
{%- endcomment -%}

  <!-- Shrimp Gallery Grid -->
  <div class="shrimp-gallery" id="shrimpGallery">
    {% for image in site.static_files %}
      {% if image.path contains '/assets/shrimps/' %}
        {% assign basename = image.basename %}
        {% assign shrimp_name = basename | replace: '-', ' ' | replace: '_', ' ' | capitalize %}

        <figure class="shrimp-item" data-full-src="{{ image.path | relative_url }}">
          <picture>
            <source
              type="image/webp"
              srcset="/assets/shrimps-optimized/{{ basename }}-320.webp 320w,
                      /assets/shrimps-optimized/{{ basename }}-640.webp 640w"
              sizes="(max-width: 480px) 45vw, 160px">
            <img
              src="/assets/shrimps-optimized/{{ basename }}-320.jpg"
              srcset="/assets/shrimps-optimized/{{ basename }}-320.jpg 320w,
                      /assets/shrimps-optimized/{{ basename }}-640.jpg 640w"
              sizes="(max-width: 480px) 45vw, 160px"
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
              alt="{{ shrimp_name }} - ebiya.sg, Singapore">
          </picture>
          <figcaption>{{ shrimp_name }}</figcaption>
        </figure>
      {% endif %}
    {% endfor %}

  </div>

  <!-- Lightbox Modal -->
  <div class="shrimp-lightbox" id="shrimpLightbox" role="dialog" aria-modal="true" aria-label="Shrimp image viewer">
    <img src="" alt="" id="lightboxImage">
    <button class="lightbox-close" id="lightboxClose" aria-label="Close image viewer">
      <span aria-hidden="true">×</span>
    </button>
    <p class="lightbox-hint">Click anywhere to close</p>
  </div>

  <!-- Shrimp information -->
  <div class="gallery-info">
    <h2>About Our Shrimp</h2>
    <p>ebiya.sg is a shrimp-breeding business in Singapore. We breed and sell Caridina shrimp, and we also sell Neocaridina.</p>

    <h3>What We Breed and Sell</h3>
    <ul>
      <li><strong>Fancy red tigers:</strong> Red and white banding with bold, irregular stripes across the body. From S$60 each.</li>
      <li><strong>Blue king kong:</strong> Black body with white bands that have a blue tint. From S$40 each.</li>
      <li><strong>White spectra:</strong> Pale, cream-white body. From S$60 each.</li>
      <li><strong>Orange boa</strong></li>
      <li><strong>Neocaridina</strong></li>
      <li><strong>Red devils:</strong> Solid red body with large white eyes. Not for sale yet.</li>
    </ul>

    <h3>Prices and Collection</h3>
    <p>Prices are per piece, and the price varies by individual shrimp. There is no minimum order. We are not GST-registered, so prices have no GST.</p>
    <p>Payment is on collection, by PayNow or cash. Collection is at 55 Changi Road, #B1-01, on Tuesday and Thursday from 1pm to 6pm, by appointment. Message us on WhatsApp at <a href="https://wa.me/6589002228">+65 8900 2228</a> to book a time.</p>

  </div>
</section>
