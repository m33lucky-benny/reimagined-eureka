---
layout: page
title: "Premium Caridina Shrimp Gallery Singapore | Taiwan Bee & Crystal Shrimp Photos"
tagline: "Singapore-bred Caridina shrimp macro photography collection"
description: "Explore our comprehensive gallery of premium Caridina shrimp bred in Singapore. High-quality photos of Taiwan Bee, Crystal Red (CRS), Crystal Black (CBS), Blue Bolt, King Kong, Panda and Pinto shrimp varieties from ebiya.sg breeding tanks."
permalink: /shrimp/
tags:
  - caridina-shrimp-singapore
  - taiwan-bee-shrimp
  - crystal-red-shrimp
  - crystal-black-shrimp
  - pinto-shrimp
  - blue-bolt-shrimp
  - king-kong-shrimp
  - shrimp-macro-photography
  - caridina-breeding-singapore
keywords:
  - caridina shrimp photos singapore
  - taiwan bee shrimp gallery
  - crystal red shrimp CRS
  - crystal black shrimp CBS
  - blue bolt shrimp breeding
  - pinto shrimp singapore
  - king kong shrimp
  - panda shrimp
  - caridina breeding tank
  - premium shrimp singapore
  - shrimp macro photography
  - freshwater shrimp gallery
  - ebiya singapore
excerpt: "Professional macro photography gallery showcasing premium Caridina shrimp varieties bred in Singapore. Features Taiwan Bee, Crystal Red/Black, Blue Bolt, King Kong, Panda, and rare Pinto shrimp from ebiya.sg's specialized breeding program."
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
