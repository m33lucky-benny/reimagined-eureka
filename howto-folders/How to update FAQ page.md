Here’s a simple **how‑to guide** you can save as `_data/faq-howto.md` or a note file in your docs folder so you can refer back to it anytime.  

***

### How to Update the FAQ Page (ebiYA.sg)

This guide explains how to add or edit FAQ questions for the Caridina shrimp page.

***

#### 1. File Location
Your FAQ data is stored in the file:
```
_data/faqs.yml
```

This file controls what appears on the **Frequently Asked Questions** page.

***

#### 2. File Structure Overview

Every FAQ section (category) looks like this:

```yaml
- title: About Caridina shrimp
  questions:
    - id: q1
      question: What are Caridina shrimp?
      answer: >
        Caridina shrimp are premium freshwater shrimp known for their vivid colors...
```

- `title:` → Category name shown in a colored header.  
- `questions:` → List of questions and answers under that category.  
- `id:` → Unique label for this FAQ (e.g., q1, q2, t1).  
- `question:` → The question shown in the accordion header.  
- `answer:` → Text shown when the question expands. You can use Markdown, like **bold**, *italic*, and lists.

***

#### 3. Adding a New FAQ

1. Scroll to the category you want (e.g., “About Caridina shrimp” or “Tank & setup”).  
2. Add a new FAQ block at the end of the `questions:` list:

   ```yaml
   - id: q9
     question: How much light do Caridina shrimp need?
     answer: >
       Moderate lighting is best. Too much light causes algae; too little reduces plant growth.
   ```

3. Save the file.  
4. Rebuild the site (`bundle exec jekyll serve`) and refresh the FAQ page.  
   The new item will appear automatically in the correct section.

***

#### 4. Editing an Existing FAQ

- To change text, edit the **question** or **answer** directly.  
- To remove an FAQ, delete the entire `- id: ...` block.  
- Keep spacing and indentation exactly as shown (2 spaces per level).  

***

#### 5. Tips

- Use `>` for multi‑line answers (preserves line breaks cleanly).  
- Keep IDs unique — don’t reuse `q1`, `q2`, etc.  
- Don’t use tabs — always spaces in YAML.  
- Use plain quotes only if your text contains symbols like `:` or `#`.

***

Would you like me to format this as a downloadable Markdown file (so you can save it in your repo)?

Sources
