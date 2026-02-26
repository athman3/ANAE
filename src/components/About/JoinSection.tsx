import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

export function JoinSection() {
  const t = useTranslations('about.join');
  const tNav = useTranslations('nav');

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
          <p className="text-lg font-medium text-primary leading-relaxed">
            {t('closing')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              <Link href="/contribute">
                {tNav('association.contribute')}
                <ArrowRight className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                {tNav('contact')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
