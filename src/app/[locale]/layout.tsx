
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CookieBanner from "@/components/CookieBanner";
import { generateMetadata as generateSEOMetadata, type Locale } from "@/lib/metadata";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.home' });

    // Utiliser la fonction utilitaire pour générer les métadonnées complètes
    return generateSEOMetadata({
        locale: locale as Locale,
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        path: '',
        image: '/og',
        imageAlt: t('imageAlt'),
        type: 'website',
    });
}

export default async function RootLayout({
    children,
    params,
}: LayoutProps) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <NextIntlClientProvider>
            <Header />
            {children}
            <Footer />
            <CookieBanner />
        </NextIntlClientProvider>
    );
}
