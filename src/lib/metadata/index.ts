import { SOCIAL_LINKS } from '@/lib/constants/socialLinks';
import type { Metadata } from 'next';

// Configuration de base
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://asociacionanae.org';
const SITE_NAME = 'ANAE';
const SITE_NAME_FULL = 'Asociación Nacional de Argelinos en España';
const DEFAULT_OG_IMAGE = '/og';

// Locales supportées
export const locales = ['ar', 'es', 'fr', 'en'] as const;
export type Locale = typeof locales[number];

// Mapping des locales pour Open Graph
const localeMapping: Record<Locale, string> = {
  ar: 'ar_DZ',
  es: 'es_ES',
  fr: 'fr_FR',
  en: 'en_US',
};

interface MetadataParams {
  locale: Locale;
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

/**
 * Génère les métadonnées complètes pour une page
 * avec support SEO, Open Graph, Twitter Cards et hreflang
 */
export function generateMetadata({
  locale,
  title,
  description,
  keywords,
  path = '',
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: MetadataParams): Metadata {
  // Construire l'URL complète
  const url = `${SITE_URL}/${locale}${path}`;
  
  // Construire l'URL de l'image complète (doit être absolue pour Telegram/Facebook)
  // S'assurer que l'image commence par / et construire l'URL absolue
  const imagePath = image.startsWith('/') ? image : `/${image}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${imagePath}`;
  
  // Générer les liens alternates pour hreflang (incluant x-default)
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    languages[loc] = `${SITE_URL}/${loc}${path}`;
  });
  languages['x-default'] = `${SITE_URL}/es${path}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    authors: author ? [{ name: author }] : [{ name: SITE_NAME_FULL }],
    creator: SITE_NAME_FULL,
    publisher: SITE_NAME_FULL,
    
    // Canonical et alternates
    alternates: {
      canonical: url,
      languages,
    },

    // Robots
    robots: noIndex ? {
      index: false,
      follow: true,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    // Open Graph
    openGraph: {
      type,
      locale: localeMapping[locale],
      alternateLocale: locales
        .filter((loc) => loc !== locale)
        .map((loc) => localeMapping[loc]),
      url,
      siteName: SITE_NAME_FULL,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    // Autres métadonnées
    category: type === 'article' ? 'article' : 'website',
  };

  return metadata;
}

/**
 * Génère le JSON-LD pour l'organisation
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME_FULL,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logos/logo_color.svg`,
    description: 'La Asociación Nacional de Argelinos en España (ANAE) trabaja incansablemente para construir puentes de esperanza, empoderar a las personas y crear cambios duraderos en nuestras comunidades.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zaragoza',
      addressCountry: 'ES',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34-674-748-699',
      contactType: 'customer service',
      email: 'contacto@asociacionanae.org',
      availableLanguage: ['Spanish', 'Arabic', 'French', 'English'],
    },
    sameAs: SOCIAL_LINKS.filter(link => link.label !== 'WhatsApp').map(link => link.href),
    taxID: 'G01968437',
  };
}

/**
 * Génère le JSON-LD pour un article de blog
 */
export function generateArticleJsonLd({
  locale,
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
}: {
  locale: Locale;
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
}) {
  const imageUrl = image && image.startsWith('http') ? image : `${SITE_URL}${image || DEFAULT_OG_IMAGE}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME_FULL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logos/logo_color.svg`,
      },
    },
    inLanguage: locale,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Génère le JSON-LD pour une page FAQ
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Génère le JSON-LD pour une page de contact
 */
export function generateContactPageJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'es' ? 'Contacto' : locale === 'en' ? 'Contact' : locale === 'fr' ? 'Contact' : 'اتصل بنا',
    description: locale === 'es' 
      ? 'Contáctanos para cualquier pregunta o asistencia' 
      : locale === 'en' 
      ? 'Contact us for any questions or assistance' 
      : locale === 'fr'
      ? 'Contactez-nous pour toute question ou assistance'
      : 'اتصل بنا لأي أسئلة أو مساعدة',
    url: `${SITE_URL}/${locale}/contact`,
  };
}

