"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { CalendarClock, HeartHandshake, Sparkles } from "lucide-react";
import HeroSection from "@/components/Hero/HeroSection";
import type { HeroStat, IconType } from "@/components/Hero/types";
import WhatWeDoSection from "@/components/Home/WhatWeDoSection";
import CulturalEventsSection from "@/components/Home/CulturalEventsSection";
import RamadanIftarSection from "@/components/Home/RamadanIftarSection";
import ServicesSection from "@/components/Home/ServicesSection";

export default function Home() {
    const tHero = useTranslations("hero");

    const currentYear = new Date().getFullYear();
    const yearsActive = Math.max(1, currentYear - 2020);

    const stats: HeroStat[] = useMemo(
        () => [
            {
                key: "years",
                label: tHero("stats.years.label"),
                value: yearsActive.toString(),
                icon: CalendarClock as IconType,
            },
            {
                key: "volunteers",
                label: tHero("stats.volunteers.label"),
                value: tHero("stats.volunteers.value"),
                icon: HeartHandshake as IconType,
            },
            {
                key: "initiatives",
                label: tHero("stats.initiatives.label"),
                value: tHero("stats.initiatives.value"),
                icon: Sparkles as IconType,
            },
        ],
        [tHero, yearsActive]
    );

    const heroCopy = useMemo(
        () => ({
            badge: tHero("badge"),
            headline: tHero("headline"),
            subheadline: tHero("subheadline"),
            primaryCta: { href: "/support-us", label: tHero("primaryCta") },
            secondaryCta: { href: "/about/gallery", label: tHero("secondaryCta") },
            scrollHint: tHero("scrollHint"),
        }),
        [tHero]
    );

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
