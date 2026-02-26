import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import NotFoundSection from "@/components/NotFound/NotFoundSection";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "seo.notFound" });

    return {
        title: t("title"),
        description: t("description"),
        robots: { index: false, follow: false },
    };
}

export default async function NotFound() {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <Header is404={true} />
            <NotFoundSection />
            <Footer />
        </NextIntlClientProvider>
    );
}
