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
    <h1 class="gallery-title">Premium Caridina Shrimp Gallery</h1>
    <p class="gallery-subtitle">Singapore-bred Taiwan Bee, Crystal & Specialty Shrimp</p>
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
              alt="{{ shrimp_name }} - Premium Caridina shrimp bred in Singapore by ebiya.sg">
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

  <!-- SEO Content Section -->
  <div class="gallery-info">
    <h2>About Our Caridina Shrimp Collection</h2>
    <p>ebiya.sg specializes in breeding premium-grade Caridina shrimp in Singapore, including rare Taiwan Bee varieties, Crystal Red Shrimp (CRS), Crystal Black Shrimp (CBS), Blue Bolt, King Kong, Panda, and exclusive Pinto patterns. All shrimp are bred in custom-designed breeding tanks optimized for water parameters and genetics.</p>
    
    <h3>Featured Shrimp Varieties</h3>
    <ul>
      <li><strong>Taiwan Bee Shrimp:</strong> King Kong, Panda, Blue Bolt premium grades</li>
      <li><strong>Crystal Shrimp:</strong> Crystal Red (CRS) and Crystal Black (CBS) in SS-SSS grades</li>
      <li><strong>Pinto Shrimp:</strong> Rare pattern variations with high coloration</li>
      <li><strong>Specialty Varieties:</strong> Custom-bred lines exclusive to Singapore</li>
    </ul>

    <h3>Custom Breeding Tanks Available</h3>
    <p>Interested in starting your own Caridina breeding program? We offer custom shrimp tanks designed specifically for breeding sensitive Caridina species, with optimized filtration, substrate, and water parameter control systems.</p>

  </div>
</section>
