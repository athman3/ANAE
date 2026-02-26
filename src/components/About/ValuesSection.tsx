import { useTranslations } from 'next-intl';

export function ValuesSection() {
  const t = useTranslations('about.values');

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  );
}
