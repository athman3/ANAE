import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/Hero/HeroSection";
import type { HeroStat } from "@/components/Hero/types";
import WhatWeDoSection from "@/components/Home/WhatWeDoSection";
import CulturalEventsSection from "@/components/Home/CulturalEventsSection";
import RamadanIftarSection from "@/components/Home/RamadanIftarSection";
import ServicesSection from "@/components/Home/ServicesSection";
import { generateMetadata as generateSEOMetadata, type Locale } from "@/lib/metadata";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo.home" });

    return generateSEOMetadata({
        locale: locale as Locale,
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
        path: "",
        image: "/images/og/og-logo.png",
        imageAlt: t("imageAlt"),
        type: "website",
    });
}

export default async function Home({ params }: PageProps) {
    const { locale } = await params;
    const tHero = await getTranslations({ locale, namespace: "hero" });

    const currentYear = new Date().getFullYear();
    const yearsActive = Math.max(1, currentYear - 2020);

    const stats: HeroStat[] = [
        {
            key: "years",
            label: tHero("stats.years.label"),
            value: yearsActive.toString(),
        },
        {
            key: "volunteers",
            label: tHero("stats.volunteers.label"),
            value: tHero("stats.volunteers.value"),
        },
        {
            key: "initiatives",
            label: tHero("stats.initiatives.label"),
            value: tHero("stats.initiatives.value"),
        },
    ];

    const heroCopy = {
        badge: tHero("badge"),
        headline: tHero("headline"),
        subheadline: tHero("subheadline"),
        primaryCta: { href: "/contribute", label: tHero("primaryCta") },
        secondaryCta: { href: "/about/gallery", label: tHero("secondaryCta") },
        tertiaryCta: { href: "/resources", label: tHero("tertiaryCta") },
        scrollHint: tHero("scrollHint"),
    };

    return (
        <div className="relative">
            <HeroSection copy={heroCopy} stats={stats} />
            <section className="relative bg-white pt-16 pb-8 md:pt-24 md:pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <WhatWeDoSection />
                    <CulturalEventsSection />
                    <RamadanIftarSection />
                    <ServicesSection />
                </div>
            </section>
        </div>
    );
}
