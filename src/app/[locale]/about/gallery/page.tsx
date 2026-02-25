import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';
import type { Metadata } from 'next';

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.gallery' });
  
  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/about/gallery',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  const tNotFound = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center mt-16 md:mt-24 lg:mt-32">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground">
          {t('title')}
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground mb-12 font-medium">
          {t('comingSoon.title')}
        </p>
        
        {/* Home Button */}
        <div>
          <Button asChild size="lg" variant="outline" className="shadow-md hover:shadow-lg transition-all">
            <Link href="/">
              <Home className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {tNotFound('actions.home')}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
