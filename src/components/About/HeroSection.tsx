import { useTranslations } from 'next-intl';

export function HeroSection() {
  const tAbout = useTranslations('about');

  return (
    <section className="bg-background pt-20 md:pt-24 pb-16 md:pb-24 w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Title & Intro */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {tAbout('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {tAbout('intro')}
          </p>
        </div>
      </div>
    </section>
  );
}
