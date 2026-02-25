import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { generateMetadata as generateSEOMetadata, type Locale } from "@/lib/metadata";
import MissionSection from "@/components/Contribute/MissionSection";
import OtherWaysToHelpSection from "@/components/Contribute/OtherWaysToHelpSection";
import TestimonialsSection from "@/components/Contribute/TestimonialsSection";
import DonationSection from "@/components/Contribute/DonationSection";

interface ContributePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContributePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contribute" });

  return generateSEOMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "/contribute",
    image: '/og',
    imageAlt: t("imageAlt"),
    type: "website",
  });
}

export default async function ContributePage({ params }: ContributePageProps) {
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
