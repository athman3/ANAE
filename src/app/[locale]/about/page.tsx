import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';

import { HeroSection } from '@/components/About/HeroSection';
import { MissionSection } from '@/components/About/MissionSection';
import { ValuesSection } from '@/components/About/ValuesSection';
import { JoinSection } from '@/components/About/JoinSection';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.about' });
  
  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/about',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  // We await params as required by Next.js 15
  await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-20">
        <HeroSection />
        <MissionSection />
        <ValuesSection />
        <JoinSection />
      </div>
    </div>
  );
}
