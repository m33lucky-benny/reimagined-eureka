Here’s an **updated README.md** with a clear section explaining **where and how to store SEO meta tags**. You can replace your existing README or merge this section in.

---

# 📝 How to Create a Post

This guide explains how to create and publish a new post in this project.

---

## 📁 Post Location

All posts are stored in the following directory:

```
/posts
```

Each post should be a **single Markdown (`.md`) file**.

---

## 🏷 File Naming Rules

Use **kebab-case** for filenames:

```
YYYY-MM-DD-post-title.md
```

### Example

```
2025-01-12-how-to-make-posts.md
```

---

## 🧱 Post Structure

Each post must start with **front matter** at the top of the file.

### Example Template

```md
---
title: "How to Make Posts"
date: 2025-01-12
author: Benny
description: "Step-by-step guide on creating posts"
tags: ["guide", "posts"]

# SEO
seoTitle: "How to Make Posts – Complete Guide"
seoDescription: "Learn how to create, format, and publish posts with proper SEO."
seoKeywords: ["blog posts", "markdown posts", "seo guide"]
seoImage: "/images/posts/how-to-make-posts.jpg"
---

## Introduction

Write your post content here.
```

---

## 📌 Front Matter Fields

### Core Fields

| Field         | Required | Description                    |
| ------------- | -------- | ------------------------------ |
| `title`       | ✅        | Post title (displayed on page) |
| `date`        | ✅        | Publish date (YYYY-MM-DD)      |
| `author`      | ❌        | Author name                    |
| `description` | ❌        | Short summary                  |
| `tags`        | ❌        | Categories or keywords         |

---

## 🔍 SEO Meta Tags

All **SEO meta tags are stored in the post front matter**.

These values are used to generate:

* `<title>`
* `<meta name="description">`
* Open Graph (Facebook, LinkedIn)
* Twitter Card metadata

### SEO Fields

| Field            | Required | Used For                          |
| ---------------- | -------- | --------------------------------- |
| `seoTitle`       | ❌        | Browser title & social previews   |
| `seoDescription` | ❌        | Meta description                  |
| `seoKeywords`    | ❌        | Search keywords (optional)        |
| `seoImage`       | ❌        | Social sharing image (OG/Twitter) |

### Notes

* If `seoTitle` is not provided, `title` will be used as a fallback
* If `seoDescription` is missing, `description` will be used
* `seoImage` should be an **absolute path** from `/public`

---

## ✍️ Writing Content

* Use **Markdown formatting**
* Headings: `##`, `###`
* Lists: `-` or `1.`
* Links: `[Text](URL)`
* Images:

  ```md
  ![Alt text](/images/example.jpg)
  ```

---

## 🖼 Images

* Store images in:

  ```
  /public/images
  ```
* SEO/social images should be at least **1200 × 630 px**

---

## 🚀 Publishing a Post

1. Create the `.md` file
2. Add front matter and content
3. Save the file in `/posts`
4. Commit and push changes

```bash
git add .
git commit -m "Add new post"
git push
```

---

## ✅ Checklist Before Publishing

* [ ] Filename follows naming rules
* [ ] Front matter is valid
* [ ] SEO title & description added
* [ ] Social image exists
* [ ] No broken links

---

If you want, I can:

* Tailor this exactly to **Next.js / Astro / Hugo**
* Auto-generate SEO fallbacks
* Add **schema / JSON-LD**
* Create a **post template file**

Just tell me what stack you’re using 👌
