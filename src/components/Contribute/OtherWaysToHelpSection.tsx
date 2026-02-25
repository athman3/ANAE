import { useTranslations } from "next-intl";
import { HeartHandshake, Briefcase, PackageOpen, Building2, ArrowRight } from "lucide-react";
import { Link as LocaleLink } from "@/i18n/navigation";

const cardIcons = [HeartHandshake, Briefcase, PackageOpen, Building2];
const cardKeys = ["volunteer", "skills", "inkind", "partner"] as const;

export default function OtherWaysToHelpSection() {
  const t = useTranslations("contribute.otherWays");

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {cardKeys.map((key, index) => {
            const Icon = cardIcons[index];
            return (
              <div
                key={key}
                className="group relative flex flex-col p-6 rounded-lg border border-border bg-card overflow-hidden hover:border-border/80 hover:shadow-sm transition-all duration-300 text-left rtl:text-right"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto -mt-6 -mr-6 rtl:-ml-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

                <div className="mb-6 flex items-baseline gap-1.5 relative z-10 text-primary drop-shadow-sm">
                  <Icon className="h-10 w-10" strokeWidth={1.5} />
                </div>
                
                <div className="relative z-10 flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {t(`cards.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`cards.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <LocaleLink
            href="/contact"
            className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
