import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.privacy' });
  
  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/privacy',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
    noIndex: false,
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              {t('title')}
            </h1>
          </div>

          <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
            <p>{t('intro')}</p>

            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.controller.title')}
                </h2>
                <p className="mb-2">{t('sections.controller.description')}</p>
                <ul className="list-none space-y-1">
                  <li><strong className="text-foreground font-medium">{t('sections.controller.org')}</strong></li>
                  <li>{t('sections.controller.nif')}</li>
                  <li>{t('sections.controller.address')}</li>
                  <li>{t('sections.controller.email')}</li>
                  <li>{t('sections.controller.phone')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.dataCollected.title')}
                </h2>
                <p className="mb-2">{t('sections.dataCollected.description')}</p>
                <p className="mb-1"><strong className="text-foreground font-medium">{t('sections.dataCollected.types.contact.title')}:</strong> {t('sections.dataCollected.types.contact.list')}</p>
                <p className="mb-1"><strong className="text-foreground font-medium">{t('sections.dataCollected.types.donations.title')}:</strong> {t('sections.dataCollected.types.donations.description')}</p>
                <p><strong className="text-foreground font-medium">{t('sections.dataCollected.types.navigation.title')}:</strong> {t('sections.dataCollected.types.navigation.list')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.purposes.title')}
                </h2>
                <p className="mb-2">{t('sections.purposes.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.purposes.list.contact')}</li>
                  <li>{t('sections.purposes.list.donations')}</li>
                  <li>{t('sections.purposes.list.improvement')}</li>
                  <li>{t('sections.purposes.list.communication')}</li>
                  <li>{t('sections.purposes.list.legal')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.legalBasis.title')}
                </h2>
                <p className="mb-2">{t('sections.legalBasis.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.legalBasis.consent')}</li>
                  <li>{t('sections.legalBasis.legitimate')}</li>
                  <li>{t('sections.legalBasis.legal')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.retention.title')}
                </h2>
                <p className="mb-2">{t('sections.retention.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.retention.contact')}</li>
                  <li>{t('sections.retention.analytics')}</li>
                </ul>
                <p className="mt-3">{t('sections.retention.after')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.recipients.title')}
                </h2>
                <p className="mb-2">{t('sections.recipients.description')}</p>
                <p className="mb-1"><strong className="text-foreground font-medium">{t('sections.recipients.providers.title')}:</strong> {t('sections.recipients.providers.list')}</p>
                <p className="mb-1"><strong className="text-foreground font-medium">{t('sections.recipients.legal.title')}:</strong> {t('sections.recipients.legal.description')}</p>
                <p className="mt-3 font-medium text-foreground">{t('sections.recipients.not')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.transfers.title')}
                </h2>
                <p className="mb-2">{t('sections.transfers.description')}</p>
                <p className="mb-2">{t('sections.transfers.google')}</p>
                <p className="mb-2">{t('sections.transfers.paypal')}</p>
                <p>{t('sections.transfers.safeguards')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.rights.title')}
                </h2>
                <p className="mb-2">{t('sections.rights.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.rights.access')}</li>
                  <li>{t('sections.rights.rectification')}</li>
                  <li>{t('sections.rights.erasure')}</li>
                  <li>{t('sections.rights.opposition')}</li>
                  <li>{t('sections.rights.portability')}</li>
                  <li>{t('sections.rights.restriction')}</li>
                  <li>{t('sections.rights.withdrawConsent')}</li>
                  <li>{t('sections.rights.complaint')}</li>
                </ul>
                <p className="mt-3 font-medium text-foreground">{t('sections.rights.exercise')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.security.title')}
                </h2>
                <p className="mb-2">{t('sections.security.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.security.measures.encryption')}</li>
                  <li>{t('sections.security.measures.access')}</li>
                  <li>{t('sections.security.measures.backup')}</li>
                  <li>{t('sections.security.measures.training')}</li>
                  <li>{t('sections.security.measures.updates')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.cookies.title')}
                </h2>
                <p>
                  {t('sections.cookies.description')}{' '}
                  <Link
                    href="/cookies"
                    className="text-primary hover:underline"
                  >
                    {t('sections.cookies.link')}
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.changes.title')}
                </h2>
                <p>{t('sections.changes.description')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.contact.title')}
                </h2>
                <p className="mb-2">{t('sections.contact.description')}</p>
                <ul className="list-none space-y-1">
                  <li>{t('sections.contact.email')}</li>
                  <li>{t('sections.contact.phone')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
