import { getTranslations } from "next-intl/server";

export default async function WhatWeDoSection() {
  const t = await getTranslations("home.sections.whatWeDo");

  return (
    <div className="mb-8 md:mb-10">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-block mb-6">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
        </div>
        {/* <p className="text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl max-w-3xl mx-auto">
          {t("description")}
        </p> */}
      </div>
    </div>
  );
}

