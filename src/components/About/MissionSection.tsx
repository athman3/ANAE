import { useTranslations } from 'next-intl';
import { Palette, Users, CalendarClock } from 'lucide-react';

const cardIcons = [Palette, Users, CalendarClock];
const cardKeys = ['culture', 'mediation', 'activities'] as const;

export function MissionSection() {
  const t = useTranslations('about.mission');

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cardKeys.map((key, index) => {
            const Icon = cardIcons[index];
            return (
              <div
                key={key}
                className="group relative flex flex-col p-6 rounded-lg border border-border bg-card overflow-hidden hover:border-border/80 hover:shadow-sm transition-all duration-300 text-left rtl:text-right"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto -mt-6 -mr-6 rtl:-ml-6 rtl:-mr-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

                <div className="mb-6 flex items-baseline gap-1.5 relative z-10 text-primary drop-shadow-sm">
                  <Icon className="h-10 w-10" strokeWidth={1.5} />
                </div>
                
                <div className="relative z-10 flex-grow space-y-3">
                  <h3 className="text-xl font-bold text-foreground">
                    {t(`points.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`points.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
