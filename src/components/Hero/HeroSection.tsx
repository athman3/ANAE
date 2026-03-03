"use client";

import { ArrowRight, Image, Library } from "lucide-react";
import { Link as LocaleLink } from "@/i18n/navigation";
import BackgroundLayer, { type VideoSource } from "@/components/Hero/BackgroundLayer";
import ScrollHint from "@/components/Hero/ScrollHint";
import type { HeroCopy, HeroStat } from "./types";

const HERO_VIDEO_SOURCES: VideoSource[] = [
    {
        src: "/images/hero/hero.mp4",
        type: "video/mp4",
    },
];

const HERO_POSTER = "/images/hero/hero.webp";

type HeroSectionProps = {
    copy: HeroCopy;
    stats: HeroStat[];
};

export default function HeroSection({ copy, stats }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            <BackgroundLayer poster={HERO_POSTER} sources={HERO_VIDEO_SOURCES} />

            <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-[90rem] flex-col justify-center gap-8 px-4 pt-32 pb-32 sm:gap-8 sm:px-6 sm:pt-28 sm:pb-28 lg:gap-12 lg:px-12 lg:pt-32 lg:pb-36">
                <HeroContent copy={copy} stats={stats} />
                <ScrollHint text={copy.scrollHint} />
            </div>

            <style jsx>{`
                .hero-pattern {
                    background-image:
                        radial-gradient(circle at 25% 20%, rgba(253, 224, 171, 0.22), transparent 55%),
                        radial-gradient(circle at 70% 30%, rgba(134, 239, 172, 0.2), transparent 55%),
                        radial-gradient(circle at 40% 78%, rgba(110, 231, 183, 0.18), transparent 55%);
                    background-size: 120% 120%;
                    animation: heroPatternShift 18s ease-in-out infinite alternate;
                }

                @keyframes heroPatternShift {
                    0% {
                        background-position: 0% 0%, 100% 50%, 50% 100%;
                    }
                    100% {
                        background-position: 100% 50%, 0% 100%, 80% 20%;
                    }
                }
            `}</style>
        </section>
    );
}

function HeroContent({ copy, stats }: { copy: HeroCopy; stats: HeroStat[] }) {
    return (
        <div className="w-full max-w-4xl space-y-8 sm:space-y-8 self-center text-center mt-8">
            
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
                {copy.headline}
            </h1>
            <p className="max-w-2xl text-base text-white/80 sm:text-lg md:text-xl mx-auto">
                {copy.subheadline}
            </p>

            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
                <LocaleLink
                    href={copy.primaryCta.href}
                    className="group inline-flex items-center justify-center rounded-full bg-amber-300 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-lg shadow-amber-400/40 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:px-6 sm:py-3"
                >
                    {copy.primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </LocaleLink>
                <LocaleLink
                    href={copy.secondaryCta.href}
                    className="group inline-flex items-center justify-center rounded-full border border-amber-100/40 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:px-6 sm:py-3"
                >
                    {copy.secondaryCta.label}
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                </LocaleLink>
                {copy.tertiaryCta && (
                    <LocaleLink
                        href={copy.tertiaryCta.href}
                        className="group inline-flex items-center justify-center rounded-full border border-amber-100/40 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:px-6 sm:py-3"
                    >
                        {copy.tertiaryCta.label}
                        <Library className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    </LocaleLink>
                )}
            </div>

            <div className="grid gap-4 pt-6 sm:gap-4 sm:pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map(({ key, value, label }, index) => (
                    <div
                        key={key}
                        className={`flex flex-col items-center justify-center rounded-lg border border-white/30 bg-white/5 p-4 text-center backdrop-blur-sm sm:p-5 ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                    >
                        <p className="text-2xl font-medium tracking-tight text-white sm:text-3xl">{value}</p>
                        <p className="text-sm font-medium text-white/90 sm:text-base mt-1">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
