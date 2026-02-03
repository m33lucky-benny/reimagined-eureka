To add more Q&A to your FAQ, just **copy-paste this exact structure** anywhere in either category section:

## Add New Question (Copy this template):

```html
<article class="faq-item">
  <button class="faq-question" role="button" tabindex="0" aria-expanded="false" aria-controls="answer-16">
    <h3>Your New Question Here?</h3>
    <span class="faq-icon" aria-hidden="true">+</span>
  </button>
  <div class="faq-answer" id="answer-16" role="region">
    <p>Your detailed answer here. Use <strong>bold</strong>, <ul> lists, or <ol> numbered lists.</p>
    <ul>
      <li>Bullet point example</li>
      <li>Another point</li>
    </ul>
  </div>
</article>
```

## 3 Simple Steps:

**1. Change the ID numbers** (answer-16, answer-17, etc.) - must be unique
**2. Write your question** in the `<h3>` tag
**3. Write your answer** in the `<div class="faq-answer">`

## Where to paste:
- **Caridina Shrimp Care section**: After the last `</article>` in that section (before `</section>`)
- **Custom Shrimp Tanks section**: Same thing

## Example - Adding "Do caridina need CO2?" as #16:

```html
<article class="faq-item">
  <button class="faq-question" role="button" tabindex="0" aria-expanded="false" aria-controls="answer-16">
    <h3>Do caridina shrimp need CO2 injection?</h3>
    <span class="faq-icon" aria-hidden="true">+</span>
  </button>
  <div class="faq-answer" id="answer-16" role="region">
    <p>Caridina shrimp <strong>do not need CO2</strong> for their health. However, low CO2 benefits plants:</p>
    <ul>
      <li>Slow-growing plants (Anubias, Bucephalandra, moss)</li>
      <li>CO2 fluctuations stress sensitive shrimp</li>
      <li>Use liquid carbon if plants struggle</li>
    </ul>
  </div>
</article>
```

**That's it!** The JavaScript automatically handles the 16th question. No code changes needed.

## Update SEO Schema (Optional):
Add to the JSON-LD script at bottom:
```json
{"@type": "Question", "name": "Do caridina shrimp need CO2 injection?", "acceptedAnswer": {"@type": "Answer", "text": "Caridina do not need CO2. Use slow-growing plants like Anubias, moss. CO2 fluctuations stress shrimp."}},
```

**Ready-to-use!** Copy the template, change text, paste between articles. Works instantly.[1]

[1](https://www.youtube.com/watch?v=ioa8T4tA4zg)
[2](https://stackoverflow.com/questions/2403146/how-to-create-expandable-faq-page-in-html)
[3](https://www.youtube.com/watch?v=IcyXS9aL4bs)
[4](https://ignitevisibility.com/use-question-answer-schema-markup/)
[5](https://elfsight.com/blog/how-to-add-faq-on-any-website-for-free/)
[6](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
[7](https://core.fiu.edu/blog/2025/the-benefits-of-adding-an-faq-page-to-your-website.html)
[8](https://dev.to/felixdusengimana/lets-create-an-faq-section-with-html-and-css-only-detail-tag-explained-12gf)
[9](https://workik.com/top-faq-section-designs-for-websites-with-html-css-and-javascript-code)
[10](https://www.zendesk.com/sg/blog/the-best-faq-page-examples-and-how-to-make-your-own/)
