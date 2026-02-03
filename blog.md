---
layout: default
title: Caridina Shrimp Care & Breeding Guides Singapore | ebiya.sg
description: Expert Caridina shrimp care guides, breeding tips, tank setup tutorials, and water parameter management for Singapore's tropical climate. Learn from experienced breeders.
keywords: caridina shrimp singapore, shrimp breeding guide, crystal red shrimp care, taiwan bee shrimp, shrimp tank setup singapore, aquarium shrimp keeping, caridina parameters, shrimp breeding singapore
tagline: Your trusted resource for keeping thriving Caridina shrimp in Singapore's tropical climate
permalink: /blog/
---

<div class="container blog-index">
  <header class="blog-header">
    <h1>Caridina Shrimp Care & Breeding Guides</h1>
    <p class="blog-intro">Expert guides, custom tank builds, and breeder notes for Singapore shrimp keepers.</p>
    
    <p class="blog-tagline">
      {{ page.tagline | default: site.tagline }}
    </p>
  </header>

  <div class="blog-list">
    {% for post in site.posts %}
      <article class="post-card">
        <h2 class="post-title">
          <a href="{{ post.url }}" class="post-link">{{ post.title }}</a>
        </h2>

        <div class="post-meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%B %d, %Y" }}
          </time>
          {% if post.categories %}
            <span class="post-categories">
              {% for category in post.categories %}
                <span class="category">{{ category }}</span>
              {% endfor %}
            </span>
          {% endif %}
        </div>

        <p class="post-excerpt">
          {{ post.excerpt | strip_html | truncatewords: 35 }}
        </p>

        <a href="{{ post.url }}" class="read-more">Read full guide &raquo;</a>
      </article>
    {% endfor %}

  </div>
</div>
