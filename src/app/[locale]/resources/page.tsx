import fs from 'fs';
import path from 'path';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';
import DirectorySectionClient from '@/components/Directory/DirectorySectionClient';
import { RESOURCES, CATEGORIES } from '@/data/directory';

import esMessages from '../../../../messages/es.json';
import frMessages from '../../../../messages/fr.json';
import enMessages from '../../../../messages/en.json';
import arMessages from '../../../../messages/ar.json';

interface ResourcesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ResourcesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.resources' });

  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/resources',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function buildSearchIndex(): Record<string, string> {
  const allMessages = [esMessages, frMessages, enMessages, arMessages];
  const index: Record<string, string> = {};

  for (const resource of RESOURCES) {
    const id = resource.id;
    const parts: string[] = [];

    for (const messages of allMessages) {
      const res = (messages.directory.resources as Record<string, { name: string; description?: string }>)[id];
      if (res) {
        parts.push(res.name);
        if (res.description) parts.push(res.description);
      }
    }

    if (resource.city) parts.push(resource.city);
    if (resource.address) parts.push(resource.address);
    if (resource.email) parts.push(resource.email);

    index[id] = normalize(parts.join(' '));
  }

  return index;
}

function getSchemaType(categoryId: string): string {
  switch (categoryId) {
    case 'consulates': return 'GovernmentOffice';
    case 'associations': return 'Organization';
    case 'language-learning': return 'WebApplication';
    case 'immigration': return 'GovernmentService';
    case 'visas': return 'GovernmentService';
    case 'legal-aid': return 'LegalService';
    case 'health': return 'MedicalOrganization';
    case 'education': return 'EducationalOrganization';
    case 'banking': return 'FinancialService';
    case 'employment': return 'EmploymentAgency';
    default: return 'Service';
  }
}

export default async function ResourcesPage(props: ResourcesPageProps) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'directory' });

  const blogDir = path.join(process.cwd(), 'content/blog');
  const existingBlogSlugs = fs.existsSync(blogDir)
    ? fs.readdirSync(blogDir).filter(entry =>
        fs.statSync(path.join(blogDir, entry)).isDirectory()
      )
    : [];

  const searchIndex = buildSearchIndex();

  const resourcesMessages = (
    locale === 'fr' ? frMessages :
    locale === 'en' ? enMessages :
    locale === 'ar' ? arMessages :
    esMessages
  ).directory.resources as Record<string, { name: string; description?: string }>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('title'),
    description: t('subtitle'),
    numberOfItems: RESOURCES.length,
    itemListElement: RESOURCES.map((resource, index) => {
      const resourceT = resourcesMessages[resource.id];
      const item: Record<string, unknown> = {
        '@type': getSchemaType(resource.categoryId),
        name: resourceT?.name ?? resource.id,
      };
      if (resourceT?.description) item.description = resourceT.description;
      if (resource.url) item.url = resource.url;
      if (resource.phone) item.telephone = resource.phone;
      if (resource.email) item.email = resource.email;
      if (resource.address && resource.city) {
        item.address = {
          '@type': 'PostalAddress',
          streetAddress: resource.address,
          addressLocality: resource.city,
          addressCountry: 'ES',
        };
      } else if (resource.city) {
        item.address = {
          '@type': 'PostalAddress',
          addressLocality: resource.city,
          addressCountry: 'ES',
        };
      }
      return {
        '@type': 'ListItem',
        position: index + 1,
        item,
      };
    }),
  };

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-10 2xl:px-12 py-16 md:py-24">
        <div className="text-center space-y-4 mb-12 md:mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {t('title')}
          </h1>
          {t('subtitle') && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('subtitle')}
            </p>
          )}
        </div>

        <DirectorySectionClient
          existingBlogSlugs={existingBlogSlugs}
          searchIndex={searchIndex}
          ssrContent={
            <div data-ssr-directory>
              {CATEGORIES
                .filter(category => RESOURCES.some(r => r.categoryId === category.id))
                .map(category => {
                const categoryResources = RESOURCES.filter(r => r.categoryId === category.id);
                return (
                  <section key={category.id} id={category.id} className="mb-12">
                    <h2 className="text-2xl font-bold mb-2 text-foreground">
                      {t(`categories.${category.id}.title`)}
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm">
                      {t(`categories.${category.id}.description`)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {categoryResources
                        .filter(resource => resourcesMessages[resource.id])
                        .map(resource => (
                          <article key={resource.id} className="p-6 rounded-lg border border-border bg-card">
                            <h3 className="text-lg font-bold text-foreground mb-2">
                              {resourcesMessages[resource.id].name}
                            </h3>
                            {resourcesMessages[resource.id].description && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {resourcesMessages[resource.id].description}
                              </p>
                            )}
                            {resource.city && (
                              <p className="text-sm text-muted-foreground">
                                {resource.city}
                                {resource.address && ` — ${resource.address}`}
                              </p>
                            )}
                            {resource.phone && (
                              <a href={`tel:${resource.phone.replace(/\s+/g, '')}`} className="text-sm text-primary block mt-1">
                                {resource.phone}
                              </a>
                            )}
                            {resource.email && (
                              <a href={`mailto:${resource.email}`} className="text-sm text-primary block mt-1">
                                {resource.email}
                              </a>
                            )}
                            {resource.url && (
                              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary block mt-1">
                                {resource.url}
                              </a>
                            )}
                          </article>
                        ))}
                    </div>
                  </section>
                );
              })}
            </div>
          }
        />
      </div>
    </main>
  );
}
