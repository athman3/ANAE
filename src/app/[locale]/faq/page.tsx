import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import FAQSection from '@/components/FAQ/FAQSection';
import { generateMetadata as generateSEOMetadata, type Locale, generateFAQJsonLd } from '@/lib/metadata';

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.faq' });
  
  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/faq',
    image: '/images/og/og-logo.png',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

export default async function FAQPage(props: FAQPageProps) {
  await props.params; // locale is used in generateMetadata, not needed here
  const t = await getTranslations('faq');
  
  // Construire les données FAQ pour le JSON-LD
  const faqData: Array<{ question: string; answer: string }> = [];
  
  // Parcourir toutes les catégories de FAQ
  const categories = ['about', 'donations', 'volunteering', 'beneficiaries', 'contact'];
  categories.forEach((category) => {
    try {
      const questions = t.raw(`categories.${category}.questions`);
      if (Array.isArray(questions)) {
        questions.forEach((q: { question: string; answer: string }) => {
          faqData.push({
            question: q.question,
            answer: q.answer,
          });
        });
      }
    } catch {
      // Ignorer si la catégorie n'existe pas
    }
  });

  const faqJsonLd = generateFAQJsonLd(faqData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <main className="min-h-screen bg-background pt-20 md:pt-20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {t('title')}
              </h1>
              {t('intro') && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t('intro')}
                </p>
              )}
            </div>

            {/* FAQ Content */}
            <FAQSection />
          </div>
        </div>
      </main>
    </>
  );
}

