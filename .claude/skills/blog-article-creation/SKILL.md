---
name: blog-article-creation
description: Guides the creation of a new multilingual blog article for the ANAE website. Use when the user wants to write a new blog post, create an article, or add content to the blog. Follows a strict step-by-step validation workflow: titles → intro paragraph → optional table of contents → section by section → MDX file assembly → resource card → image prompt. Never skip a validation step. Never do web research unless explicitly asked by the user.
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

### Step 7 — Image Prompt

After all MDX files are created and the resource card is added, generate an **image prompt** for the article's illustration.

The target tool is **Imagen 3** (Google — formerly "Nano Banana 2"), available via Google AI Studio or Gemini. No special flags or parameters — the ratio (16:9 recommended for blog images) is set in the interface, not in the prompt.

#### Step 7a — Suggest and ask for reference photos

**Before generating the prompt, proactively suggest what reference photos would help**, based on the article subject. Then ask the user to share them.

For example:
- Article about a health card → suggest: *"A photo of the tarjeta sanitaria (the physical card) would help reproduce it accurately in the illustration."*
- Article about the NIE → suggest: *"A photo of the NIE document (the green A4 certificate) would help."*
- Article about the Algerian consulate → suggest: *"A photo of the consulate building facade would help set the scene."*
- Article about Bizum → suggest: *"A screenshot of the Bizum app or the Bizum logo would help."*

**Always suggest at least 2–3 concrete photo ideas** relevant to the article, then ask:

> "Do you have any of these photos (or others) to share? If yes, please share them now — it will help make the prompt more accurate."

**Wait for the user's response:**
- If the user shares photos: **analyse them carefully** to extract precise visual details (colors, shape, format, distinctive graphic elements, typography style, material texture). Incorporate these details into the prompt as specific descriptors.
- If the user has no reference photos: proceed with generic visual elements based on the article subject.

**Example:** If the article is about the Algerian passport and the user shares a photo of it — extract: "burgundy/dark red cover, gold embossed Algerian coat of arms (crescent and star), booklet format" and integrate into the prompt: *"holding a dark red Algerian passport with gold embossed crescent and star on the cover"*.

#### Step 7b — Generate the prompt

**Prompt formula:**

```
[Subject] + [Action/moment] + [Location/context] + [Composition detail] + [Style]
```

**Fixed style elements** to always include at the end of every prompt:

```
realistic photography, warm natural light, soft focus background, human moment, no text, no logos, documentary style
```

**Rules:**
- The scene must be **human and concrete**: show a real person doing something related to the article subject (e.g. receiving a document, speaking at a counter, filling a form).
- The context must be **administrative, institutional, or everyday life** — not abstract, not symbolic.
- Avoid tech/startup aesthetics, floating icons, infographic-style compositions.
- Always include an **Algerian cultural touch** in the scene: the person should be of North African appearance AND carry a recognisable Algerian visual element (e.g. hijab, traditional clothing, henna, an Algerian passport, a djellaba, a haik, or other culturally identifiable detail). The goal is that a viewer can intuitively feel the Algerian connection without relying on text.
- Never describe text, labels, or signs in the scene.
- If reference photos were provided, integrate the specific visual details extracted from them.

**Always propose 3 different prompt approaches**, each with a distinct visual angle, so the user can choose the one that best fits. Label each approach clearly (e.g. **Option 1**, **Option 2**, **Option 3**) and ask the user to pick one before finalising.

**Output format:**

Present each option as a ready-to-copy block, then suggest the image path for the frontmatter:

```
**Option 1:**
{prompt}

**Option 2:**
{prompt}

**Option 3:**
{prompt}

**Suggested image path:** `/images/blog/{slug}.jpg`
```

**Wait for the user to choose an option** before considering Step 7 complete.

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
| 7a | Ask user for reference photos | ✅ Wait for response |
| 7b | Propose 3 prompt approaches | ✅ User chooses one |
