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
    noIndex: false, // Cookie pages should be indexed
  });
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  const t = await getTranslations('cookies');

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('lastUpdated')}: {new Date().toLocaleDateString(locale === 'ar' ? 'ar-ES' : locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
            <p className="text-lg leading-relaxed mb-8">
              {t('intro')}
            </p>

            <div className="space-y-8">
              {/* Section 1: What are Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.whatAre.title')}
                </h2>
                <p>{t('sections.whatAre.description')}</p>
              </div>

              {/* Section 2: Types of Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.types.title')}
                </h2>
                <p className="mb-4">{t('sections.types.description')}</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t('sections.types.technical.title')}
                    </h3>
                    <p className="mb-3">{t('sections.types.technical.description')}</p>
                    <ul className="list-disc list-inside space-y-2 rtl:list-inside rtl:text-right">
                      <li>{t('sections.types.technical.list.session')}</li>
                      <li>{t('sections.types.technical.list.security')}</li>
                      <li>{t('sections.types.technical.list.preferences')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t('sections.types.notUsed.title')}
                    </h3>
                    <p className="mb-3">{t('sections.types.notUsed.description')}</p>
                    <ul className="list-disc list-inside space-y-2 rtl:list-inside rtl:text-right">
                      <li>{t('sections.types.notUsed.list.analytics')}</li>
                      <li>{t('sections.types.notUsed.list.advertising')}</li>
                      <li>{t('sections.types.notUsed.list.social')}</li>
                      <li>{t('sections.types.notUsed.list.tracking')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3: Purpose */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.purpose.title')}
                </h2>
                <p className="mb-3">{t('sections.purpose.description')}</p>
                <ul className="list-disc list-inside space-y-2 rtl:list-inside rtl:text-right">
                  <li>{t('sections.purpose.list.functionality')}</li>
                  <li>{t('sections.purpose.list.security')}</li>
                  <li>{t('sections.purpose.list.preferences')}</li>
                </ul>
              </div>

              {/* Section 4: Duration */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.duration.title')}
                </h2>
                <p className="mb-3">{t('sections.duration.description')}</p>
                <ul className="list-disc list-inside space-y-2 rtl:list-inside rtl:text-right">
                  <li>{t('sections.duration.session')}</li>
                  <li>{t('sections.duration.temporary')}</li>
                </ul>
              </div>

              {/* Section 5: Third-Party */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.thirdParty.title')}
                </h2>
                <p>{t('sections.thirdParty.description')}</p>
              </div>

              {/* Section 6: Cookie Table */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.cookieTable.title')}
                </h2>
                <p className="mb-4">{t('sections.cookieTable.description')}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.name')}</th>
                        <th className="px-4 py-3 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.owner')}</th>
                        <th className="px-4 py-3 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.type')}</th>
                        <th className="px-4 py-3 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.purpose')}</th>
                        <th className="px-4 py-3 text-start font-semibold text-foreground">{t('sections.cookieTable.headers.duration')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['cookieConsent', 'ga', 'gaId', 'gid', 'gclAu', 'gac'] as const).map((key) => (
                        <tr key={key} className="border-b border-border">
                          <td className="px-4 py-3 font-mono text-xs">{t(`sections.cookieTable.cookies.${key}.name`)}</td>
                          <td className="px-4 py-3">{t(`sections.cookieTable.cookies.${key}.owner`)}</td>
                          <td className="px-4 py-3">{t(`sections.cookieTable.cookies.${key}.type`)}</td>
                          <td className="px-4 py-3">{t(`sections.cookieTable.cookies.${key}.purpose`)}</td>
                          <td className="px-4 py-3">{t(`sections.cookieTable.cookies.${key}.duration`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7: Management */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.management.title')}
                </h2>
                <p className="mb-3">{t('sections.management.description')}</p>
                <ul className="list-disc list-inside space-y-2 rtl:list-inside rtl:text-right">
                  <li>{t('sections.management.instructions.chrome')}</li>
                  <li>{t('sections.management.instructions.firefox')}</li>
                  <li>{t('sections.management.instructions.safari')}</li>
                  <li>{t('sections.management.instructions.edge')}</li>
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  {t('sections.management.note')}
                </p>
              </div>

              {/* Section 7: Consent */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.consent.title')}
                </h2>
                <p className="mb-3">{t('sections.consent.description')}</p>
                <p>{t('sections.consent.future')}</p>
                <RevokeConsentButton />
              </div>

              {/* Section 8: Updates */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.updates.title')}
                </h2>
                <p>{t('sections.updates.description')}</p>
              </div>

              {/* Section 9: Contact */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('sections.contact.title')}
                </h2>
                <p className="mb-3">{t('sections.contact.description')}</p>
                <ul className="list-none space-y-2">
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

