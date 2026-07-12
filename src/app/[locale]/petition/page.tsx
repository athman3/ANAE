import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';
import PetitionForm from '@/components/Petition/PetitionForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.petition' });

  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/petition',
    image: '/images/og/og-logo.png',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

export default async function PetitionPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'petition' });

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 md:pt-28">
        <section className="border-b bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
        </section>

        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <section aria-labelledby="context-heading">
              <h2
                id="context-heading"
                className="mb-6 text-2xl font-bold text-foreground"
              >
                {t('context.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t('context.p1')}</p>
                <p>{t('context.p2')}</p>
                <p>{t('context.p3')}</p>
              </div>
            </section>

            <section aria-labelledby="form-heading">
              <h2
                id="form-heading"
                className="mb-6 text-2xl font-bold text-foreground"
              >
                {t('form.fields.signature')}
              </h2>
              <PetitionForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
