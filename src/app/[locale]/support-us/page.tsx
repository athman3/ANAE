import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { generateMetadata as generateSEOMetadata, type Locale } from "@/lib/metadata";
import MissionSection from "@/components/SupportUs/MissionSection";
import OtherWaysToHelpSection from "@/components/SupportUs/OtherWaysToHelpSection";
import TestimonialsSection from "@/components/SupportUs/TestimonialsSection";
import DonationSection from "@/components/SupportUs/DonationSection";

interface SupportUsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SupportUsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.supportUs" });

  return generateSEOMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "/support-us",
    image: '/og',
    imageAlt: t("imageAlt"),
    type: "website",
  });
}

export default async function SupportUsPage({ params }: SupportUsPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-20">
        <DonationSection />
        <MissionSection />
        <OtherWaysToHelpSection />
        <TestimonialsSection />
      </div>
    </div>
  );
}
