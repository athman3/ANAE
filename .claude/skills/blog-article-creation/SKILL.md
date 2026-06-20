---
name: blog-article-creation
description: Guides the creation of a new multilingual blog article for the ANAE website. Use when the user wants to write a new blog post, create an article, or add content to the blog. Follows a strict step-by-step validation workflow: titles → optional table of contents → section by section → MDX file assembly. Never skip a validation step. Never do web research unless explicitly asked by the user.
---

# Blog Article Creation — ANAE

This skill guides the creation of a multilingual blog article across 4 locales: **French (fr)**, **Spanish (es)**, **English (en)**, and **Arabic (ar)**.

The article will be saved as:
```
content/blog/{slug}/
├── fr/index.mdx
├── es/index.mdx
├── en/index.mdx
└── ar/index.mdx
```

---

## Core Rules

- **Never move to the next step without explicit user validation.**
- **Never do web research or make up content.** You are guided by the user at every step.
- **Always wait for "ok", "valide", "yes", or equivalent before continuing.**
- The validation pattern is always: **propose in 1 language → wait → translate to 3 others → wait → continue.**
- Arabic requires special attention: wrap any phone number or LTR-only string with `U+202A` before and `U+202C` after (e.g. `‪+34 915 629 705‬`).

---

## Workflow

### Step 0 — Gather the topic

Ask the user:
1. What is the article about? (brief description of the subject)
2. Who is the target audience?
3. Any specific points, data, or information to include?

Do not proceed until you have enough context.

---

### Step 1 — Titles

1. Propose **several title options** in **one language** (prefer French unless the user specifies otherwise).
2. **Wait for the user to choose and validate one title.**
3. Propose the translations of the validated title in the **3 remaining languages** (es, en, ar).
4. **Wait for the user to validate the translations** (or request adjustments).
5. Once all 4 titles are validated, record them and move to Step 2.

> Show titles clearly labeled by language, e.g.:
> - 🇫🇷 fr: ...
> - 🇪🇸 es: ...
> - 🇬🇧 en: ...
> - 🇸🇦 ar: ...

---

### Step 2 — Intro Paragraph + Table of Contents

**Always write a short introductory paragraph** (2–3 sentences) that will appear before the TOC. It should summarise the article and its value to the reader. Propose it in one language, validate, then translate to 3 others.

**Then, assess whether a table of contents is relevant** for this article:
- A table of contents is useful for **long guides, step-by-step tutorials, and comprehensive reference articles.**
- It is **not necessary** for short posts, news items, announcements, or brief explainers.

If a table of contents is relevant:
1. Propose the table of contents (section headings) in **one language**.
2. **Wait for the user to validate or adjust the structure.**
3. Translate the validated structure into the **3 remaining languages**.
4. **Wait for the user to validate the translations.**
5. Once validated, this becomes the section plan for Step 3.

If a table of contents is not relevant:
- Inform the user and propose a simple section list to guide Step 3 (even without a visible TOC, you need to know the article structure).

---

### Step 3 — Section by Section

For **each section** in the validated plan, repeat this sub-workflow:

1. Write the section content in **one language** (the same language used throughout, prefer French).
2. **Wait for the user to validate or request changes.**
3. Translate the validated section into the **3 remaining languages**.
4. **Wait for the user to validate the translations** (or request adjustments).
5. Move to the next section.

> Do not write multiple sections at once. One section at a time.

**Arabic translation reminders:**
- Use RTL-compatible phrasing.
- Wrap phone numbers with LTR markers: `‪{number}‬`
- Use official Algerian/Spanish administrative terminology (do not guess — ask the user if unsure).

---

### Step 4 — Frontmatter

Once all sections are validated, ask the user for:
- `date` — publication date (YYYY-MM-DD format), if not provided use today's date
- `image` — image path (e.g. `/images/blog/article-image.jpg`), or leave empty
- `tags` — list of relevant tags

The `author` field is always **"ANAE Team"** — never ask for it.

Then propose a `description` (meta description, 150–160 characters) in all 4 languages following the same validation pattern: one language → validate → 3 translations → validate.

Also propose a URL `slug` (lowercase, hyphens, English only, e.g. `health-card-guide`).

---

### Step 5 — Assembly

Generate the 4 complete MDX files using the following structure:

```mdx
---
title: "Validated title for this locale"
description: "Validated description for this locale"
date: "YYYY-MM-DD"
author: "Author Name"
image: "/images/blog/image.jpg"
tags: ["tag1", "tag2"]
draft: false
locale: "xx"
---

{Short introductory paragraph — 2-3 sentences summarising the article and its value to the reader. Written before the TOC, not inside any section heading.}

## Table of Contents / Tabla de contenidos / Table des matières / فهرس المحتويات

1. [Section 1 title](#anchor-1)
2. [Section 2 title](#anchor-2)
...

## Section 1 title

{content}

## Section 2 title

{content}
```

**MDX structure rules:**
- The intro paragraph comes **before** the TOC, directly after the frontmatter.
- The TOC comes **before** the first section heading.
- If no TOC is needed (short article), the intro paragraph still comes first.
- Anchors in the TOC are auto-generated by `rehype-slug` from the heading text — use lowercase, hyphens, no special characters.

Create the files at:
- `content/blog/{slug}/fr/index.mdx`
- `content/blog/{slug}/es/index.mdx`
- `content/blog/{slug}/en/index.mdx`
- `content/blog/{slug}/ar/index.mdx`

### Step 6 — Resources Directory

After creating the MDX files, add the article as a resource card in the `/resources` directory page.

1. **Add the resource entry** in `src/data/directory.ts` under the appropriate category:

```typescript
{
  id: '{slug}',
  categoryId: '{category}',  // e.g. 'health', 'banking', 'immigration'
  type: 'article',
  blogSlug: '{slug}',
},
```

2. **Add the translation keys** in all 4 locale files (`messages/{ar,es,fr,en}.json`) under `directory.resources`:

```json
"{slug}": {
  "name": "{validated article title for this locale}",
  "description": "{validated article description for this locale}"
}
```

**Rules:**
- `name` must match exactly the validated article title for that locale.
- `description` must match exactly the validated article description (150–160 chars) for that locale.
- `categoryId` must match one of the existing categories in `CATEGORIES` array in `directory.ts`: `consulates`, `immigration`, `language-learning`, `employment`, `housing`, `legal-aid`, `health`, `education`, `transport`, `associations`, `made-by-algerians`, `banking`, `visas`.

---

## Summary Table

| Step | Action | Validation required |
|------|--------|-------------------|
| 0 | Gather topic & context | ✅ Before starting |
| 1 | Propose titles (1 lang) | ✅ Choose & validate |
| 1b | Translate titles (3 langs) | ✅ Validate translations |
| 2 | Write intro paragraph (1 lang) | ✅ Validate content |
| 2b | Translate intro paragraph (3 langs) | ✅ Validate translations |
| 2c | Assess if TOC needed | — |
| 2d | Propose TOC (1 lang) | ✅ Validate structure |
| 2e | Translate TOC (3 langs) | ✅ Validate translations |
| 3 | Write section (1 lang) | ✅ Validate content |
| 3b | Translate section (3 langs) | ✅ Validate translations |
| 4 | Gather frontmatter + descriptions | ✅ Validate |
| 5 | Assemble 4 MDX files | ✅ Final check |
| 6 | Add resource card to /resources directory | — (automatic) |
