import type { ComponentType, SVGProps } from "react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export type HeroStat = {
    key: string;
    label: string;
    value: string;
    icon?: IconType;
};

export type HeroCta = {
    href: string;
    label: string;
};

export type HeroCopy = {
    headline: string;
    subheadline: string;
    primaryCta: HeroCta;
    secondaryCta: HeroCta;
    tertiaryCta?: HeroCta;
    scrollHint: string;
    badge?: string;
};
