import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';

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
  await params;
  const t = await getTranslations('about');

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('title')}
            </h1>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('intro')}
            </p>
          </div>

          {/* Mission Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              {t('mission.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('mission.description')}
            </p>
            
            <div className="space-y-8 mt-8">
              {/* Culture Point */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {t('mission.points.culture.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('mission.points.culture.description')}
                </p>
              </div>

              {/* Mediation Point */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {t('mission.points.mediation.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('mission.points.mediation.description')}
                </p>
              </div>

              {/* Activities Point */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {t('mission.points.activities.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('mission.points.activities.description')}
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              {t('values.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('values.description')}
            </p>
          </section>

          {/* Join Us Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              {t('join.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('join.description')}
            </p>
            <p className="text-lg font-medium text-primary leading-relaxed">
              {t('join.closing')}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
