import { MetadataRoute } from 'next';
import { locales } from '@/lib/metadata';
import { getAllPosts } from '@/lib/blog';
import { getPathname } from '@/i18n/navigation';
import fs from 'fs';
import path from 'path';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://asociacionanae.org';

const STATIC_PAGE_CONFIG: Record<string, { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; lastModified: string }> = {
  '':               { changeFrequency: 'daily',   priority: 1.0, lastModified: '2025-01-01' },
  '/blog':          { changeFrequency: 'daily',   priority: 0.9, lastModified: '2025-01-01' },
  '/resources':     { changeFrequency: 'daily',   priority: 0.9, lastModified: '2025-01-01' },
  '/about':         { changeFrequency: 'monthly', priority: 0.7, lastModified: '2025-01-01' },
  '/contact':       { changeFrequency: 'monthly', priority: 0.7, lastModified: '2025-01-01' },
  '/faq':           { changeFrequency: 'monthly', priority: 0.7, lastModified: '2025-01-01' },
  '/contribute':    { changeFrequency: 'monthly', priority: 0.7, lastModified: '2025-01-01' },
  '/about/gallery': { changeFrequency: 'yearly',  priority: 0.4, lastModified: '2025-01-01' },
  '/privacy':       { changeFrequency: 'yearly',  priority: 0.3, lastModified: '2025-01-01' },
  '/cookies':       { changeFrequency: 'yearly',  priority: 0.3, lastModified: '2025-01-01' },
};

function findPages(dir: string, basePath: string = ''): string[] {
  const routes: string[] = [];

  if (!fs.existsSync(dir)) {
    return routes;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const routePath = basePath ? `${basePath}/${entry.name}` : `/${entry.name}`;

    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
        continue;
      }

      const subRoutes = findPages(fullPath, routePath);
      routes.push(...subRoutes);
    } else if (entry.name === 'page.tsx') {
      routes.push(basePath || '');
    }
  }

  return routes;
}

async function buildAlternates(route: string): Promise<Record<string, string>> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const pathname = await getPathname({ locale, href: route || '/' });
    languages[locale] = `${SITE_URL}${pathname}`;
  }
  languages['x-default'] = languages['es'];
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result: MetadataRoute.Sitemap = [];
  const localeDir = path.join(process.cwd(), 'src', 'app', '[locale]');

  const staticRoutes = findPages(localeDir);

  for (const route of staticRoutes) {
    const languages = await buildAlternates(route);
    const config = STATIC_PAGE_CONFIG[route] ?? { changeFrequency: 'monthly' as const, priority: 0.6, lastModified: '2025-01-01' };

    for (const locale of locales) {
      const pathname = await getPathname({ locale, href: route || '/' });
      result.push({
        url: `${SITE_URL}${pathname}`,
        lastModified: new Date(config.lastModified),
        changeFrequency: config.changeFrequency,
        priority: config.priority,
        alternates: { languages },
      });
    }
  }

  const firstLocale = locales[0];
  const allPosts = await getAllPosts(firstLocale);
  const slugs = allPosts.map((p) => p.slug);

  for (const slug of slugs) {
    const blogRoute = `/blog/${slug}`;

    const blogLanguages: Record<string, string> = {};
    for (const locale of locales) {
      const altPathname = await getPathname({ locale, href: blogRoute });
      blogLanguages[locale] = `${SITE_URL}${altPathname}`;
    }
    blogLanguages['x-default'] = blogLanguages['es'];

    for (const locale of locales) {
      const posts = await getAllPosts(locale);
      const post = posts.find((p) => p.slug === slug);
      if (!post) continue;

      const pathname = await getPathname({ locale, href: blogRoute });
      const lastMod = post.updatedAt ?? post.date;

      result.push({
        url: `${SITE_URL}${pathname}`,
        lastModified: new Date(lastMod),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: blogLanguages },
      });
    }
  }

  return result;
}
