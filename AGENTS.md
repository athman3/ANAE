# AGENTS.md - ANAE Project Guidelines

This document provides guidelines for AI coding agents working on the ANAE (Asociación Nacional de Argelinos en España) codebase — a non-profit Algerian cultural association website based in Zaragoza, Spain.

## Project Overview

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Runtime**: React 19
- **Styling**: Tailwind CSS with shadcn/ui components (New York style, neutral base)
- **i18n**: next-intl v4 for 4 locales: Arabic (ar), Spanish (es), French (fr), English (en)
- **Default locale**: Spanish (`es`)
- **UI Components**: Radix UI primitives, Lucide icons
- **Content**: MDX for blog posts (gray-matter, next-mdx-remote, remark-gfm, rehype-slug, rehype-autolink-headings)
- **Email**: nodemailer via SMTP for contact form
- **Theme**: next-themes (ThemeProvider exists, dark mode CSS vars defined, theme switching not wired up)

## Build/Lint/Test Commands

**Important for AI Agents:** Do not run `npm run build` after every single code modification. Only run a build at the very end of your task to verify everything compiles correctly, or if you specifically need to debug a complex type/build issue. Running builds constantly slows down the development process.

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run dev:turbo        # Start dev server with Turbopack (faster)

# Build & Production
npm run build            # Production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint (next/core-web-vitals + next/typescript)
```

Note: This project does not have a test suite configured. If adding tests, use Vitest or Jest with React Testing Library.

## Project Structure

```
/
├── .env.example                    # SMTP + site URL env var templates
├── components.json                 # shadcn/ui config (new-york, neutral)
├── mdx-components.tsx              # Global custom MDX components (h1-h6, p, ul, ol, li, blockquote, pre, code, a, hr, table, img) with RTL support
├── next.config.ts                  # MDX + next-intl + security headers (HSTS, X-Frame-Options, CSP)
├── tailwind.config.ts              # shadcn CSS vars, dark mode, typography, animate plugins; safelisted dynamic colors
├── tsconfig.json                   # strict mode, `@/*` → `./src/*` alias
├── content/
│   └── blog/
│       └── {slug}/                 # One folder per article
│           └── {locale}/           # ar/ en/ es/ fr/
│               └── index.mdx       # Article content with frontmatter
├── messages/
│   ├── ar.json                     # Arabic translations
│   ├── es.json                     # Spanish (primary/most complete)
│   ├── fr.json                     # French translations
│   └── en.json                     # English translations
├── public/
│   └── images/
│       ├── blog/                   # Blog post images
│       ├── hero/                   # hero.jpg + hero.mp4
│       ├── home/                   # Homepage section images
│       ├── icons/                  # bizum-logo.svg, paypal-logo.svg, santander-icon.svg, santander-logo.svg
│       ├── logos/                  # logo.svg, logo_color.svg
│       ├── og/                     # og-logo.png (1200x630, used as default OG image)
│       └── screenshots/
└── src/
    ├── app/
    │   ├── layout.tsx              # Root layout: RTLProvider + inline script (RTL flash prevention) + Organization JSON-LD
    │   ├── globals.css             # Tailwind + shadcn CSS vars (light + dark) + [dir="rtl"] { direction: rtl }
    │   ├── not-found.tsx           # Global 404 (NextIntlClientProvider + Header is404 + Footer)
    │   ├── robots.ts               # Disallows /api/, /_next/, /admin/, /private/
    │   ├── sitemap.ts              # Auto-generates sitemap: static pages + blog slugs per locale
    │   ├── og/route.tsx            # Edge runtime: generates ANAE SVG OG image (1200×630)
    │   └── [locale]/
    │       ├── layout.tsx          # Locale layout: hasLocale check + NextIntlClientProvider + Header + Footer
    │       ├── not-found.tsx       # Locale 404 → <NotFoundSection />
    │       ├── page.tsx            # Home page ("use client", HeroSection + 4 home sections)
    │       ├── about/
    │       │   ├── page.tsx        # About page (Server Component)
    │       │   └── gallery/page.tsx # Gallery - "Coming Soon" page
    │       ├── blog/
    │       │   ├── page.tsx        # Blog list (Server Component, getAllPosts, BlogCard grid)
    │       │   └── [slug]/page.tsx # Blog post (MDXRemote, generateStaticParams, ReadingProgressBar, Article JSON-LD)
    │       ├── contact/page.tsx    # Contact page (Server Component, ContactSection, ContactPage JSON-LD)
    │       ├── cookies/page.tsx    # Cookies policy (Server Component, full i18n content)
    │       ├── faq/page.tsx        # FAQ page (Server Component, FAQSection, FAQ JSON-LD)
    │       ├── privacy/page.tsx    # Privacy policy (Server Component)
    │       └── support-us/page.tsx # Support Us page (Server Component, 4 sections)
    ├── app/api/
    │   └── contact/route.ts        # POST only; rate limiting (5 req/15min), sanitization, nodemailer SMTP
    ├── components/
    │   ├── RTLProvider.tsx         # "use client"; useLayoutEffect to set html dir + lang on pathname change
    │   ├── theme-provider.tsx      # next-themes ThemeProvider wrapper (not currently wired into any layout)
    │   ├── Header/
    │   │   ├── Header.tsx          # Composes TopBar + Navigation; accepts is404 prop
    │   │   ├── TopBar.tsx          # "use client"; fixed dark bar (z-80); hides on scroll; social links; FAQ link; GitHub stars (cached in localStorage 1h)
    │   │   ├── Navigation.tsx      # "use client"; fixed nav (z-70); transparent on home hero, white on scroll; mobile hamburger; LanguageSelector; DonateButton
    │   │   └── AssociationDropdown.tsx # Radix DropdownMenu; links: /about, /about/gallery, /support-us
    │   ├── Hero/
    │   │   ├── HeroSection.tsx     # "use client"; fullscreen video hero
    │   │   ├── BackgroundLayer.tsx # memo'd; <video autoPlay muted loop playsInline> + gradient overlay
    │   │   ├── HeroSummary.tsx
    │   │   ├── ScrollHint.tsx
    │   │   └── types.ts            # IconType, HeroStat, HeroCta, HeroCopy interfaces
    │   ├── Home/
    │   │   ├── WhatWeDoSection.tsx
    │   │   ├── CulturalEventsSection.tsx
    │   │   ├── RamadanIftarSection.tsx
    │   │   └── ServicesSection.tsx
    │   ├── Blog/
    │   │   ├── BlogCard.tsx        # Card with image, tags (Badge), title, description, meta; RTL-aware
    │   │   ├── BlogLayout.tsx      # prose prose-lg wrapper with RTL support; accepts isRTL prop
    │   │   └── ReadingProgressBar.tsx # "use client"; fixed progress bar; MutationObserver + requestAnimationFrame
    │   ├── Contact/
    │   │   └── ContactSection.tsx  # "use client"; controlled form + fetch /api/contact; success/error states; auto-reset after 5s
    │   ├── FAQ/
    │   │   └── FAQSection.tsx      # "use client"; accordion via useState; uses t.raw() for categories
    │   ├── Footer/
    │   │   └── Footer.tsx          # "use client" (usePathname for RTL); 4-column grid; social links reversed in RTL
    │   ├── NotFound/
    │   │   └── NotFoundSection.tsx # "use client"; 404 with home button
    │   └── SupportUs/
    │       ├── DonationSection.tsx # "use client"; impact cards + payment methods (SEPA/PayPal/Bizum) with copy buttons
    │       ├── HeroSection.tsx
    │       ├── MissionSection.tsx
    │       ├── OtherWaysToHelpSection.tsx
    │       └── TestimonialsSection.tsx # "use client"; infinite auto-scroll carousel with scale effect; data from src/data/testimonials.ts
    ├── components/ui/
    │   ├── badge.tsx               # shadcn Badge
    │   ├── button.tsx              # shadcn Button
    │   ├── card.tsx                # shadcn Card
    │   ├── dropdown-menu.tsx       # shadcn DropdownMenu
    │   ├── input.tsx               # shadcn Input
    │   ├── DonateButton.tsx        # "use client"; animated green button → opens DonationModal
    │   ├── DonationModal.tsx       # "use client"; createPortal to body (z-100); PayPal/Bizum/SEPA; copy-to-clipboard
    │   └── LanguageSelector.tsx    # "use client"; Globe icon; reads language name+flag from messages JSON; handles 404 case
    ├── data/
    │   └── testimonials.ts         # Static testimonials data with lang + dir fields (fr/ar/es)
    ├── i18n/
    │   ├── routing.ts              # defineRouting: locales ['ar','es','fr','en'], defaultLocale 'es'
    │   ├── request.ts              # getRequestConfig: loads messages/{locale}.json
    │   └── navigation.ts          # createNavigation exports: Link, redirect, usePathname, useRouter, getPathname
    ├── lib/
    │   ├── utils.ts                # cn() = twMerge(clsx(...))
    │   ├── blog/
    │   │   ├── index.ts            # Re-exports from mdx.ts + types.ts
    │   │   ├── mdx.ts              # getAllPosts, getPostBySlug, getAllTags, getPostsByTag, getAllSlugs, getRecentPosts; readingTime @ 200 wpm; sorted by date desc
    │   │   └── types.ts            # BlogPostMetadata, BlogPost, BlogPostSummary interfaces
    │   ├── constants/
    │   │   └── socialLinks.ts      # SOCIAL_LINKS array (Facebook/YouTube/Instagram/WhatsApp); CONTACT_INFO object
    │   ├── hooks/
    │   │   └── useIsHomePage.ts    # "use client"; matches pathname === '/' or /^\/[a-z]{2}$/
    │   ├── metadata/
    │   │   └── index.ts            # generateMetadata(), generateOrganizationJsonLd(), generateArticleJsonLd(), generateFAQJsonLd(), generateContactPageJsonLd()
    │   └── utils/
    │       ├── navigationStyles.ts # getNavBackgroundClasses, TextClasses, LinkClasses, etc. — all take {is404, isHomePage, scrolled}
    │       ├── rateLimit.ts        # In-memory IP rate limiter: 5 req/15min; getClientIP() checks x-forwarded-for + x-real-ip
    │       └── sanitizeHtml.ts     # sanitizeHtml() (escapes &<>"') + sanitizeEmailContent() (trim + maxLength)
    └── middleware.ts               # Custom Accept-Language detection for root '/'; falls back to next-intl middleware
```

## Code Style Guidelines

### Comments

- **NO unnecessary comments**: Do not add comments to explain what the code does
- Code should be self-explanatory through clear naming and structure
- Only add comments for complex business logic or non-obvious workarounds
- Never add comments like `// Logo section`, `// Handle click`, etc.

### TypeScript

- **Strict mode enabled** - No implicit any, strict null checks
- Use explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/primitives
- Import types with `type` keyword: `import type { Metadata } from 'next'`

```typescript
// Good
interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  // ...
}
```

### Imports

- Use path aliases: `@/components`, `@/lib`, `@/lib/utils`
- Order: React/Next.js, external packages, internal modules, types
- Group imports logically with blank lines between groups

```typescript
import { NextRequest, NextResponse } from 'next/server';

import { useTranslations } from 'next-intl';
import { CalendarClock, HeartHandshake } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { HeroStat } from '@/components/Hero/types';
```

### Naming Conventions

- **Components**: PascalCase (`Header.tsx`, `HeroSection.tsx`)
- **Utilities**: camelCase (`utils.ts`, `rateLimit.ts`)
- **Config files**: kebab-case (`next.config.ts`, `tailwind.config.ts`)
- **Translation files**: lowercase locale (`ar.json`, `es.json`)
- **Translation keys**: Nested, semantic (`nav.home`, `seo.homepage.title`)

### Naming Conventions for Data Files

- Static data lives in `src/data/` (e.g., `testimonials.ts`)
- Shared constants live in `src/lib/constants/` (e.g., `socialLinks.ts`)
- Custom hooks live in `src/lib/hooks/` (e.g., `useIsHomePage.ts`)

### Component Patterns

- Use `"use client"` directive only when needed (hooks, interactivity)
- Default exports for page components and main components
- Named exports for utilities and UI components
- Use React.forwardRef for UI primitives
- Use `React.memo` for expensive components (e.g., `BackgroundLayer.tsx`)

### Styling with Tailwind CSS

- Use `cn()` utility for conditional classes (from `@/lib/utils`)
- Use CSS variables for theming: `bg-background`, `text-foreground`
- Use semantic color tokens: `primary`, `secondary`, `muted`, `destructive`
- Dynamic class names that Tailwind cannot statically detect (e.g., `hover:text-blue-500`) must be added to the `safelist` in `tailwind.config.ts`

## Internal Navigation (Critical)

**Always use `Link`, `useRouter`, `redirect`, and `usePathname` from `@/i18n/navigation`** for internal links — it handles locale prefixing automatically.

```typescript
// CORRECT — locale-aware navigation
import { Link, usePathname, useRouter } from '@/i18n/navigation';

// INCORRECT — bypasses locale prefixing
import Link from 'next/link';
import { usePathname } from 'next/navigation';
```

**Exception**: Use `usePathname` from `next/navigation` (raw pathname) only when checking the current locale for RTL detection (e.g., `pathname.startsWith('/ar')`).

## RTL Support (Critical)

Arabic locale requires full RTL support. The system operates on three layers:

### Layer 1 — Inline Script (Flash Prevention)
The root `app/layout.tsx` includes an inline `<script>` that sets `dir` and `lang` on `<html>` before hydration to prevent layout flash.

### Layer 2 — RTLProvider Component
`src/components/RTLProvider.tsx` uses `useLayoutEffect` to update `html[dir]` and `html[lang]` on every route change. It reads the pathname and sets `dir="rtl"` for `/ar/*` routes.

### Layer 3 — Tailwind RTL Classes
```tsx
// Horizontal spacing — ALWAYS add rtl:space-x-reverse
<div className="flex items-center space-x-3 rtl:space-x-reverse">

// Flex direction reversal
<div className="flex flex-row rtl:flex-row-reverse">

// Text alignment
<p className="text-left rtl:text-right">
```

### RTL Array Order
When social link arrays are rendered with `rtl:space-x-reverse`, reverse the array for Arabic to maintain visual order:
```typescript
const links = isRTL ? [...SOCIAL_LINKS].reverse() : SOCIAL_LINKS;
```

### CSS Logical Properties in MDX
Use CSS logical properties in `mdx-components.tsx` for RTL-compatible spacing:
- `ms-6` instead of `ml-6`
- `ps-6` instead of `pl-6`
- `border-s-4` instead of `border-l-4`

Test all components with Arabic locale (`/ar/*`) to verify RTL layout.

## Internationalization (i18n)

### Using Translations

```typescript
// Client components
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');
return <h1>{t('key')}</h1>;

// Server components / metadata
import { getTranslations } from 'next-intl/server';
const t = await getTranslations({ locale, namespace: 'seo.homepage' });

// Raw structured data (arrays/objects)
const categories = t.raw('faq.categories');
```

### Existing i18n Namespaces

All 4 locale files (`messages/{ar,es,fr,en}.json`) contain these namespaces:

| Namespace | Contents |
|---|---|
| `language` | `name`, `flag` emoji |
| `nav` | `home`, `association.{title,about,gallery,supportUs}`, `contact`, `blog`, `donate`, `supportUs` |
| `hero` | `badge`, `headline`, `subheadline`, `primaryCta`, `secondaryCta`, `summaryCta`, `scrollHint`, `stats.{years,initiatives,volunteers}` |
| `location` | `city`, `country` |
| `footer` | `description`, `quickLinks`, `contact`, `legal`, `copyright`, `registration`, `taxId`, `developedBy` |
| `donation` | `title`, `subtitle`, `methods.{paypal,bizum,sepa}`, `close`, `secure`, `transparency` |
| `contact` | `title`, `subtitle`, `info.{email,phone,whatsapp,address}`, `social`, `form.{fields,placeholders,submit,sending,success,error}` |
| `blog` | `title`, `description`, `noPosts`, `minRead` |
| `notFound` | `title`, `subtitle`, `description`, `actions.home` |
| `about` | `title`, `intro`, `mission.{title,description,points}`, `values`, `join` |
| `gallery` | `title`, `description`, `comingSoon.{title,description,photos,videos,events}` |
| `home.sections` | `whatWeDo`, `culturalEvents`, `ramadanIftar`, `services` |
| `privacy` | `title`, `lastUpdated`, `intro`, `sections.{controller,dataCollected,purposes,...}` |
| `cookies` | `title`, `lastUpdated`, `intro`, `sections.{whatAre,types,purpose,...}` |
| `supportUs` | `hero`, `mission`, `testimonials`, `donation.{amounts,currency,payment,...}`, `otherWays` |
| `faq` | `title`, `intro`, `categories.{about,donations,volunteering,beneficiaries,contact}` |
| `seo.home` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.about` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.contact` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.blog` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.faq` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.privacy` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.cookies` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.gallery` | `title`, `description`, `keywords`, `imageAlt` |
| `seo.supportUs` | `title`, `description`, `keywords`, `imageAlt` |

### Cleanup and Maintenance (IMPORTANT)
**Whenever you delete code, components, or entire features**, you MUST proactively search the project to check if the removed code was using any translation keys. If it was, you must immediately delete those unused keys from ALL locale JSON files (`messages/*.json`) to keep the codebase clean.

## SEO Metadata (Mandatory for New Pages)

Every page in `/src/app/[locale]/*/page.tsx` MUST have metadata. The `generateSEOMetadata()` function generates Open Graph, Twitter Cards, hreflang, and canonical URLs automatically.

```typescript
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.pageName' });

  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/page-path',
    image: '/images/og/og-logo.png',
    imageAlt: t('imageAlt'),
    type: 'website', // or 'article' for blog posts
  });
}
```

### Blog Article Metadata

```typescript
return generateSEOMetadata({
  locale: locale as Locale,
  title: post.title,
  description: post.description,
  path: `/blog/${slug}`,
  image: post.image,
  imageAlt: post.title,
  type: 'article',
  author: post.author,
  publishedTime: post.date,
});
```

### Add SEO translations in all 4 language files

```json
{
  "seo": {
    "pageName": {
      "title": "Page Title (50-60 chars)",
      "description": "Engaging description (150-160 chars)",
      "keywords": "keyword1, keyword2, keyword3",
      "imageAlt": "Image description"
    }
  }
}
```

### Page Title Convention (Mandatory)

All page titles MUST follow the `ANAE - {Page Name}` format — `ANAE` first, then a dash, then the localized page name. This applies to every locale and every page.

```
ANAE - Contacto              ✅ correct
ANAE - Contact               ✅ correct
ANAE - اتصل بنا              ✅ correct

Contacto - ANAE              ❌ wrong (ANAE not first)
Contact - ANAE | Get in Touch ❌ wrong (ANAE not first, extra suffix)
ANAE | Contact               ❌ wrong (use dash, not pipe)
```

For blog articles, prepend `ANAE - ` to the article title in code (not in frontmatter):
```typescript
const fullTitle = `ANAE - ${post.title}`;
```

### Metadata Checklist
Before creating a new page, ensure:
- [ ] `generateMetadata()` function implemented
- [ ] SEO translations added in all 4 languages (ar, es, fr, en)
- [ ] Title follows the `ANAE - {Page Name}` convention in all 4 locales
- [ ] Title is 50-60 characters
- [ ] Description is 150-160 characters
- [ ] Keywords are relevant and specific
- [ ] Open Graph image specified (`imageAlt` included)
- [ ] Path matches the route
- [ ] `type` is correct (`website` or `article`)

## JSON-LD Structured Data

Use the utility functions from `@/lib/metadata` to add structured data. JSON-LD is already implemented on:
- **Root layout** (`app/layout.tsx`): Organization JSON-LD (always present)
- **Blog posts** (`[slug]/page.tsx`): Article JSON-LD
- **FAQ page**: FAQ JSON-LD
- **Contact page**: ContactPage JSON-LD

### How to add JSON-LD to a page

```tsx
import { generateFAQJsonLd } from '@/lib/metadata';

export default async function Page({ params }: PageProps) {
  const jsonLd = generateFAQJsonLd(faqData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

Available functions: `generateOrganizationJsonLd()`, `generateArticleJsonLd()`, `generateFAQJsonLd()`, `generateContactPageJsonLd()`.

## Blog System

### Content Structure

Blog articles follow this directory structure:
```
content/blog/
└── {slug}/           # e.g., bizum-guide/
    ├── ar/
    │   └── index.mdx
    ├── en/
    │   └── index.mdx
    ├── es/
    │   └── index.mdx
    └── fr/
        └── index.mdx
```

The same slug is used across all locales; language is determined by the subdirectory.

### Frontmatter Fields

```yaml
---
title: "Article title"
description: "Article description"
date: "2024-01-15"
author: "Author Name"
image: "/images/blog/article-image.jpg"  # optional
tags: ["tag1", "tag2"]                   # optional
draft: false                              # optional, defaults to false
locale: "es"                             # must match directory
---
```

### Blog Utilities (`src/lib/blog/mdx.ts`)

- `getAllPosts(locale)` — returns all published posts for a locale, sorted by date desc
- `getPostBySlug(slug, locale)` — returns a single post with full MDX content
- `getAllSlugs()` — returns all slugs for `generateStaticParams`
- `getAllTags(locale)` — returns all unique tags
- `getPostsByTag(tag, locale)` — returns posts filtered by tag
- `getRecentPosts(locale, count)` — returns N most recent posts
- Reading time is calculated at 200 words per minute

### Static Params and Arabic Slugs

```typescript
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug: encodeURIComponent(slug), // Required for Arabic slugs
    }))
  );
}
```

### Custom MDX Components

`mdx-components.tsx` (root) provides styled versions of all HTML elements with RTL support using CSS logical properties (`ms-`, `ps-`, `border-s-`).

## API Routes

### Contact Form (`/api/contact`)

- **Method**: POST only
- **Rate limiting**: 5 requests per 15 minutes per IP
- **Input sanitization**: `sanitizeHtml()` + `sanitizeEmailContent()` on all fields
- **Transport**: nodemailer via SMTP (see environment variables)

### Form Handling Pattern

```typescript
// Standard pattern for client-side form submission
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000); // Auto-reset after 5s
  } catch {
    setError(t('form.error'));
  } finally {
    setIsSubmitting(false);
  }
};
```

## Security

### Rate Limiting

`src/lib/utils/rateLimit.ts` — in-memory limiter, 5 requests per 15 minutes per IP. The `getClientIP()` function checks `x-forwarded-for` and `x-real-ip` headers.

### Input Sanitization

Always sanitize user input before processing:

```typescript
import { sanitizeHtml, sanitizeEmailContent } from '@/lib/utils/sanitizeHtml';

const cleanName = sanitizeHtml(rawName);           // Escapes &, <, >, ", '
const cleanMessage = sanitizeEmailContent(rawMsg); // trim + maxLength
```

### Security Headers

Configured in `next.config.ts`:
- HSTS (2 years)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Content-Security-Policy (report-only)

### Error Handling

- Use try/catch for all async operations
- Return appropriate HTTP status codes in API routes
- Log errors in development only (`process.env.NODE_ENV === 'development'`)
- Never expose sensitive error details to clients

## Environment Variables

Defined in `.env.example`:

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://asociacionanae.org

# SMTP (Contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465              # 465 = SSL, 587 = TLS
SMTP_USER=your@email.com   # Sender email / Gmail account
SMTP_PASS=your-app-password # Gmail App Password (not account password)
CONTACT_TO_EMAIL=recipient@email.com # Where contact emails are delivered

# SEO (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

## Z-Index Architecture

| Layer | Z-Index | Component |
|---|---|---|
| Donation Modal | z-100 | `DonationModal.tsx` |
| TopBar | z-80 | `TopBar.tsx` |
| Navigation | z-70 | `Navigation.tsx` |

## Design Philosophy

- **NO startup/tech-style design**: Avoid modern tech aesthetics, minimalist gradients, neon colors
- Prefer traditional, professional, culturally appropriate designs that reflect the association's values
- Use warm, welcoming colors and classic layouts suitable for a cultural association
- Avoid flashy animations or overly trendy design patterns

## Accessibility

- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, etc.)
- Include proper ARIA attributes where needed (`aria-label`, `aria-expanded`, `aria-hidden`)
- Ensure all interactive elements are keyboard-navigable
- Provide `alt` text for all images

## Best Practices

1. **RTL First**: Always consider RTL when building new components — test `/ar/*` pages
2. **SEO Mandatory**: Every new page MUST have complete metadata + SEO translations in 4 languages
3. **Title Convention**: Every page title MUST follow `ANAE - {Page Name}` format in all 4 locales — never `Page - ANAE`, never with pipes
4. **i18n Navigation**: Always use `Link`, `useRouter`, `redirect` from `@/i18n/navigation`
4. **No Startup/Tech Design**: Avoid startup-like or tech-style aesthetics
5. **Consistent RTL Spacing**: Use `rtl:space-x-reverse` for all horizontal spacing
6. **Translation Cleanup**: Delete unused translation keys from all 4 locale files when removing code
7. **Semantic HTML**: Use proper HTML elements for accessibility
8. **Semantic Translation Keys**: Use descriptive, nested keys (`nav.home` not `text1`)
9. **Server vs Client Components**: Pages are Server Components; interactive sections are `"use client"`
10. **Performance**: Use `React.memo` for expensive render-heavy components
11. **Structured Data**: Add JSON-LD when applicable (FAQ, Contact, Articles)
12. **Static Data**: Put static arrays/objects in `src/data/` or `src/lib/constants/`
13. **Navigation Styles**: Extract nav style logic to `src/lib/utils/navigationStyles.ts`
14. **Accessibility**: Include proper ARIA attributes and semantic HTML

## Key Files Reference

- `next.config.ts` — Next.js config with MDX and i18n plugins + security headers
- `tailwind.config.ts` — Tailwind with shadcn/ui theme + safelisted dynamic colors
- `mdx-components.tsx` — Custom MDX component renderers with RTL support
- `src/app/layout.tsx` — Root layout: inline RTL script + Organization JSON-LD
- `src/middleware.ts` — Accept-Language detection + next-intl i18n routing
- `src/i18n/routing.ts` — Locale configuration (`['ar','es','fr','en']`, default `'es'`)
- `src/i18n/navigation.ts` — Locale-aware `Link`, `useRouter`, `usePathname`, `redirect`
- `src/app/robots.ts` — Robots.txt generation
- `src/app/sitemap.ts` — Sitemap generation
- `src/app/og/route.tsx` — Dynamic OG image generation (Edge runtime)
- `src/components/RTLProvider.tsx` — RTL detection + `html[dir]` management
- `src/lib/metadata/index.ts` — SEO metadata + JSON-LD utility functions
- `src/lib/constants/socialLinks.ts` — Shared social links and contact info
- `src/lib/utils/navigationStyles.ts` — Navigation color/style logic
- `src/lib/utils/rateLimit.ts` — In-memory rate limiter
- `src/lib/utils/sanitizeHtml.ts` — Input sanitization utilities
- `src/lib/blog/mdx.ts` — Blog content utilities
- `components.json` — shadcn/ui configuration
