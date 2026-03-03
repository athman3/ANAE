import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function ServicesSection() {
  const t = await getTranslations("home.sections.services");

  return (
    <div className="mb-8 md:mb-10">
      <div className="bg-muted/20 py-8 md:py-12 rounded-lg px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content - First on mobile, right on desktop */}
          <div className="order-1 lg:order-2">
            <h3 className="mb-6 text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
              {t("title")}
            </h3>
            <p className="text-lg leading-8 text-muted-foreground md:text-xl">
              {t("description")}
            </p>
          </div>

          {/* Image - Second on mobile, left on desktop */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden bg-muted/30">
              <Image
                src="/images/home/services/services.webp"
                alt={t("title")}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 580px"
                loading="lazy"
                quality={75}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

