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

  <!-- Shrimp Gallery: Latest row, then one section per type -->
  {% assign published_photos = site.data.gallery | where: "published", true | sort: "date" | reverse %}
  <div id="shrimpGallery">
    {% if published_photos.size > 0 %}
    <section class="gallery-section gallery-section--latest" aria-labelledby="gallery-latest">
      <h2 class="gallery-section-title" id="gallery-latest">Latest</h2>
      <div class="shrimp-gallery shrimp-gallery--latest">
        {% for entry in published_photos limit: 8 %}
          <figure class="shrimp-item" data-full-src="{{ '/assets/shrimps/' | append: entry.file | append: '.jpg' | relative_url }}">
            <img
              src="{{ '/assets/shrimps-optimized/' | append: entry.file | append: '-320.jpg' | relative_url }}"
              srcset="{{ '/assets/shrimps-optimized/' | append: entry.file | append: '-320.jpg' | relative_url }} 320w,
                      {{ '/assets/shrimps-optimized/' | append: entry.file | append: '-640.jpg' | relative_url }} 640w"
              sizes="(max-width: 480px) 30vw, 160px"
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
              alt="{{ entry.caption }} - ebiya.sg, Singapore">
            <figcaption>{{ entry.caption }}</figcaption>
          </figure>
        {% endfor %}
      </div>
    </section>
    {% endif %}

    {% for type in site.data.gallery_types %}
      {% assign type_photos = published_photos | where: "type", type.slug %}
      {% if type_photos.size > 0 %}
      <section class="gallery-section" id="type-{{ type.slug }}" aria-labelledby="heading-{{ type.slug }}">
        <h2 class="gallery-section-title" id="heading-{{ type.slug }}">{{ type.name }}</h2>
        {% if type.note != "" %}<p class="gallery-section-note">{{ type.note }}</p>{% endif %}
        <div class="shrimp-gallery">
          {% for entry in type_photos %}
          <figure class="shrimp-item" data-full-src="{{ '/assets/shrimps/' | append: entry.file | append: '.jpg' | relative_url }}">
            <img
              src="{{ '/assets/shrimps-optimized/' | append: entry.file | append: '-320.jpg' | relative_url }}"
              srcset="{{ '/assets/shrimps-optimized/' | append: entry.file | append: '-320.jpg' | relative_url }} 320w,
                      {{ '/assets/shrimps-optimized/' | append: entry.file | append: '-640.jpg' | relative_url }} 640w"
              sizes="(max-width: 480px) 30vw, 160px"
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
              alt="{{ entry.caption }} - ebiya.sg, Singapore">
            <figcaption>{{ entry.caption }}</figcaption>
          </figure>
          {% endfor %}
        </div>
      </section>
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
      <li><strong>Orange boa:</strong> From S$60 each.</li>
      <li><strong>Neocaridina</strong></li>
      <li><strong>Red devils:</strong> Solid red body with large white eyes. Not for sale yet.</li>
    </ul>

    <h3>Prices and Collection</h3>
    <p>Prices are per piece, and the price varies by individual shrimp. There is no minimum order. We are not GST-registered, so prices have no GST.</p>
    <p>Payment is on collection, by PayNow or cash. Collection is at 55 Changi Road, #B1-01, on Tuesday and Thursday from 1pm to 6pm, by appointment. Message us on WhatsApp at <a href="https://wa.me/6589002228">+65 8900 2228</a> to book a time.</p>

  </div>
</section>
