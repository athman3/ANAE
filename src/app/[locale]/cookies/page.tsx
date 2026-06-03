import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';
import RevokeConsentButton from './RevokeConsentButton';

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CookiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.cookies' });
  
  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/cookies',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
    noIndex: false,
  });
}

export default async function CookiesPage() {
  const t = await getTranslations('cookies');

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
                  {t('sections.whatAre.title')}
                </h2>
                <p>{t('sections.whatAre.description')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.types.title')}
                </h2>
                <p className="mb-3">{t('sections.types.description')}</p>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {t('sections.types.technical.title')}
                    </h3>
                    <p className="mb-2">{t('sections.types.technical.description')}</p>
                    <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                      <li>{t('sections.types.technical.list.session')}</li>
                      <li>{t('sections.types.technical.list.security')}</li>
                      <li>{t('sections.types.technical.list.preferences')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {t('sections.types.notUsed.title')}
                    </h3>
                    <p className="mb-2">{t('sections.types.notUsed.description')}</p>
                    <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                      <li>{t('sections.types.notUsed.list.analytics')}</li>
                      <li>{t('sections.types.notUsed.list.advertising')}</li>
                      <li>{t('sections.types.notUsed.list.social')}</li>
                      <li>{t('sections.types.notUsed.list.tracking')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.purpose.title')}
                </h2>
                <p className="mb-2">{t('sections.purpose.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.purpose.list.functionality')}</li>
                  <li>{t('sections.purpose.list.security')}</li>
                  <li>{t('sections.purpose.list.preferences')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.duration.title')}
                </h2>
                <p className="mb-2">{t('sections.duration.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.duration.session')}</li>
                  <li>{t('sections.duration.temporary')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.thirdParty.title')}
                </h2>
                <p>{t('sections.thirdParty.description')}</p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.cookieTable.title')}
                </h2>
                <p className="mb-3">{t('sections.cookieTable.description')}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-3 py-2 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.name')}</th>
                        <th className="px-3 py-2 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.owner')}</th>
                        <th className="px-3 py-2 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.type')}</th>
                        <th className="px-3 py-2 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.purpose')}</th>
                        <th className="px-3 py-2 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.duration')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['cookieConsent', 'ga', 'gaId', 'gid', 'gclAu', 'gac'] as const).map((key) => (
                        <tr key={key} className="border-b border-border">
                          <td className="px-3 py-2 font-mono">{t(`sections.cookieTable.cookies.${key}.name`)}</td>
                          <td className="px-3 py-2">{t(`sections.cookieTable.cookies.${key}.owner`)}</td>
                          <td className="px-3 py-2">{t(`sections.cookieTable.cookies.${key}.type`)}</td>
                          <td className="px-3 py-2">{t(`sections.cookieTable.cookies.${key}.purpose`)}</td>
                          <td className="px-3 py-2">{t(`sections.cookieTable.cookies.${key}.duration`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.management.title')}
                </h2>
                <p className="mb-2">{t('sections.management.description')}</p>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside rtl:text-right">
                  <li>{t('sections.management.instructions.chrome')}</li>
                  <li>{t('sections.management.instructions.firefox')}</li>
                  <li>{t('sections.management.instructions.safari')}</li>
                  <li>{t('sections.management.instructions.edge')}</li>
                </ul>
                <p className="mt-3 font-medium text-foreground">
                  {t('sections.management.note')}
                </p>
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.consent.title')}
                </h2>
                <p className="mb-2">{t('sections.consent.description')}</p>
                <p className="mb-3">{t('sections.consent.future')}</p>
                <RevokeConsentButton />
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {t('sections.updates.title')}
                </h2>
                <p>{t('sections.updates.description')}</p>
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
