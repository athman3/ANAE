import { MetadataRoute } from 'next';
import { locales } from '@/lib/metadata';
import { getAllSlugs } from '@/lib/blog';
import { getPathname } from '@/i18n/navigation';
import fs from 'fs';
import path from 'path';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://asociacionanae.org';

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
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];
  const localeDir = path.join(process.cwd(), 'src', 'app', '[locale]');

  const staticRoutes = findPages(localeDir);

  for (const route of staticRoutes) {
    const languages = await buildAlternates(route);

    for (const locale of locales) {
      const pathname = await getPathname({ locale, href: route || '/' });
      sitemap.push({
        url: `${SITE_URL}${pathname}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: { languages },
      });
    }
  }

  for (const locale of locales) {
    const blogSlugs = await getAllSlugs(locale);
    for (const slug of blogSlugs) {
      const blogRoute = `/blog/${slug}`;
      const pathname = await getPathname({ locale, href: blogRoute });

      const blogLanguages: Record<string, string> = {};
      for (const loc of locales) {
        const altPathname = await getPathname({ locale: loc, href: blogRoute });
        blogLanguages[loc] = `${SITE_URL}${altPathname}`;
      }

      sitemap.push({
        url: `${SITE_URL}${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: blogLanguages },
      });
    }
  }

  return sitemap;
}
