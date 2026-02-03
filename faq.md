---
layout: default
title: FAQ - Custom Caridina Shrimp Tanks & Water Parameters Guide | ebiya.sg Singapore
description: Expert answers on custom shrimp tanks, caridina shrimp care, water parameters, TDS levels, breeding tips, and aquarium setup services in Singapore. Professional shrimp keeping advice from ebiya.sg.
keywords: caridina shrimp FAQ, custom shrimp tank Singapore, shrimp water parameters, TDS for shrimp, shrimp breeding guide, aquarium setup Singapore, neocaridina vs caridina, shrimp tank cycling
permalink: /faq/
schema_type: FAQPage
---

<div class="faq-container">
  <header class="faq-header">
    <h1>Frequently Asked Questions</h1>
    <p class="faq-subtitle">Everything you need to know about custom shrimp tanks, setup services, ordering, and aquarium solutions from ebiya.sg.</p>
    <p class="faq-care-link">
      For Caridina shrimp care questions (water parameters, cycling, breeding), visit our 
      <a href="/caridina-shrimp-care-guide/" class="inline-link">Caridina Care Guide</a>.
    </p>
  </header>

{% assign faq_id = 0 %}
{% for category in site.data.faqs %}

  <section class="faq-category" id="cat-{{ forloop.index }}">
    <h2 class="category-title">{{ category.title }}</h2>

    {% for faq in category.questions %}
      {% assign faq_id = faq_id | plus: 1 %}
      <div class="faq-item" id="faq-{{ faq_id }}">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-{{ faq_id }}-answer">
          <span class="faq-question-text">{{ faq.question }}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" id="faq-{{ faq_id }}-answer" role="region" aria-hidden="true">
          {{ faq.answer | markdownify }}
        </div>
      </div>
    {% endfor %}

  </section>
  {% endfor %}
</div>

<!-- JSON-LD Structured Data for SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {% assign faqs_flat = site.data.faqs | map: 'questions' | flatten %}
    {% for faq in faqs_flat %}
    {
      "@type": "Question",
      "name": "{{ faq.question | escape }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ faq.answer | strip_html | escape }}"
      }
    }{% if forloop.last == false %},{% endif %}
    {% endfor %}
  ]
}
</script>
