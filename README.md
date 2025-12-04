# Asociación Nacional de Argelinos en España (ANAE)

Welcome to the official website project for the **Asociación Nacional de Argelinos en España (ANAE)**.

**Live Website:** [https://asociacionanae.org](https://asociacionanae.org)

## Preview

![Homepage Demo](./public/images/screenshots/homepage-demo.png)

## About the Association

The **Asociación Nacional de Argelinos en España (ANAE)** is a non-profit organization dedicated to promoting and celebrating the rich cultural heritage of Algeria within Spain. Our mission is to foster a sense of community among Algerians in Spain and to share our vibrant culture with the wider Spanish society.

We aim to organize cultural events, workshops, and social gatherings to showcase Algerian traditions, music, art, and cuisine. Through our activities, we hope to build bridges of understanding and friendship between the Algerian and Spanish communities.

## About this Project

This project is the official landing page for the ANAE. It is built with [Next.js](https://nextjs.org) and serves as a central hub for information about the association, our events, and how to get involved.

### Getting Started with Development

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and fill in your values
# See .env.example for all available variables
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

The project requires several environment variables. See [`.env.example`](./.env.example) for a complete list with descriptions.

**Required variables:**
- `NEXT_PUBLIC_SITE_URL` - Full URL of your site (e.g., `https://asociacionanae.org`)
- `SMTP_HOST` - SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (e.g., `465` for SSL, `587` for TLS)
- `SMTP_USER` - Email for authentication (also used as sender email)
- `SMTP_PASS` - Application password 
- `CONTACT_TO_EMAIL` - Recipient email for contact form

**Optional variables:**
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - Google Search Console verification code

## Features

- **Multilingual** - Support for 4 languages (Spanish, French, English, Arabic)
- **RTL Support** - Full Right-to-Left layout support for Arabic language
- **Responsive** - Optimized for mobile and desktop
- **Blog System** - MDX-powered blog with GitHub Flavored Markdown
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, hreflang, and structured data (JSON-LD)
- **Contact Form** - Secure contact form with email integration (SMTP), input validation, sanitization, and rate limiting
- **Sitemap & Robots** - Automatically generated sitemap.xml and robots.txt for better SEO
- **Accessible** - WCAG AA compliant with Radix UI components
- **Performance** - Static generation, optimized images
- **Security** - Input sanitization, rate limiting, and secure email handling
- **TypeScript** - Full TypeScript support for type safety
- **Modern UI** - Tailwind CSS with custom design system and Radix UI primitives

## TODO

- [ ] **Redis for email** - Rate limiting and email queue with Redis
- [ ] **Gallery page** - Complete gallery implementation
- [ ] **Interactive Resources Map** - Interactive map with categorized markers (tags) for important addresses for Algerians in Spain (embassies, consulates, administrative offices, cultural centers).
## Project Structure

```
ANAE/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── i18n/             # Internationalization
├── content/blog/         # Blog articles (MDX)
├── messages/             # Translation files
└── public/               # Static assets
```

## Available Routes

All routes are available in 4 languages: **Arabic (ar)**, **Spanish (es)**, **French (fr)**, and **English (en)**.

### Public Pages

- `/{locale}/` - Homepage
- `/{locale}/about` - About the association
- `/{locale}/about/gallery` - Photo gallery
- `/{locale}/blog` - Blog listing page
- `/{locale}/blog/[slug]` - Individual blog post (dynamic route)
- `/{locale}/contact` - Contact form
- `/{locale}/faq` - Frequently Asked Questions
- `/{locale}/privacy` - Privacy policy
- `/{locale}/cookies` - Cookie policy

### API Routes

- `/api/contact` - Contact form submission endpoint (POST)

### Special Routes

- `/{locale}/not-found` - 404 error page

### Examples

- `https://asociacionanae.org/es/` - Spanish homepage
- `https://asociacionanae.org/ar/about` - About page in Arabic (RTL)
- `https://asociacionanae.org/fr/blog` - Blog in French
- `https://asociacionanae.org/en/contact` - Contact page in English


