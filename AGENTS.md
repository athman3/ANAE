# AGENTS.md - ANAE Project Guidelines

This document provides guidelines for AI coding agents working on the ANAE (Asociacion Nacional de Argelinos en Espana) codebase.

## Project Overview

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with shadcn/ui components (New York style)
- **i18n**: next-intl for 4 locales: Arabic (ar), Spanish (es), French (fr), English (en)
- **UI Components**: Radix UI primitives, Lucide icons
- **Content**: MDX for blog posts

## Build/Lint/Test Commands

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
src/
├── app/                  # Next.js App Router
│   ├── [locale]/         # Internationalized routes
│   ├── api/              # API routes (e.g., /api/contact)
│   └── globals.css       # Global styles with CSS variables
├── components/           # React components
│   ├── ui/               # shadcn/ui base components
│   ├── Header/           # Navigation components
│   ├── Hero/             # Landing hero section
│   └── Home/             # Homepage sections
├── lib/                  # Utilities and helpers
│   ├── utils.ts          # cn() function for class merging
│   ├── utils/            # Utility modules (rateLimit, sanitizeHtml)
│   ├── metadata/         # SEO metadata generators
│   └── blog/             # Blog/MDX utilities
├── i18n/                 # Internationalization config
│   ├── routing.ts        # Locale routing (ar, es, fr, en)
│   ├── navigation.ts     # Navigation helpers
│   └── request.ts        # Request handling
messages/                 # Translation JSON files (ar.json, es.json, fr.json, en.json)
content/blog/             # MDX blog articles organized by slug/locale
public/images/            # Static assets (hero, logos, icons, og)
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

### Component Patterns

- Use `"use client"` directive only when needed (hooks, interactivity)
- Default exports for page components and main components
- Named exports for utilities and UI components
- Use React.forwardRef for UI primitives

### Styling with Tailwind CSS

- Use `cn()` utility for conditional classes (from `@/lib/utils`)
- Use CSS variables for theming: `bg-background`, `text-foreground`
- Use semantic color tokens: `primary`, `secondary`, `muted`, `destructive`

## RTL Support (Critical)

Arabic locale requires full RTL support. Always include RTL classes:

```tsx
// Horizontal spacing - ALWAYS add rtl:space-x-reverse
<div className="flex items-center space-x-3 rtl:space-x-reverse">

// Flex direction reversal
<div className="flex flex-row rtl:flex-row-reverse">

// Text alignment
<p className="text-left rtl:text-right">
```

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
```

## SEO Metadata (Mandatory for New Pages)

Every page in `/src/app/[locale]/*/page.tsx` MUST have metadata:

```typescript
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

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
  });
}
```

## Error Handling

- Use try/catch for async operations
- Return appropriate HTTP status codes in API routes
- Log errors in development only (`process.env.NODE_ENV === 'development'`)
- Never expose sensitive error details to clients

## Design Philosophy

- **NO startup/tech-style design**: Avoid modern tech aesthetics, minimalist gradients
- Prefer traditional, professional, culturally appropriate designs
- Use warm, welcoming colors and classic layouts
- Avoid flashy animations or trendy design patterns

## Key Files Reference

- `next.config.ts` - Next.js config with MDX and i18n plugins
- `tailwind.config.ts` - Tailwind with shadcn/ui theme
- `src/middleware.ts` - i18n routing middleware
- `src/lib/metadata/index.ts` - SEO metadata utilities
- `src/i18n/routing.ts` - Locale configuration
- `components.json` - shadcn/ui configuration
