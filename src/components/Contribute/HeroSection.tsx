"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const t = useTranslations("contribute.hero");

  const scrollToDonation = () => {
    const element = document.getElementById("donation-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {t("subtitle")}
        </p>

        <Button
          onClick={scrollToDonation}
          size="lg"
          className="h-14 rounded-full px-8 text-lg font-medium"
        >
          {t("cta")}
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
