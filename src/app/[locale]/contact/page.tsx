import { Metadata } from "next";
import ContactSection from "@/components/Contact/ContactSection";
import { generateMetadata as generateSEOMetadata, type Locale, generateContactPageJsonLd } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.contact' });
  
  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/contact',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const contactJsonLd = generateContactPageJsonLd(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="pt-24 md:pt-28">
          <ContactSection />
        </div>
      </div>
    </>
  );
}
