import type { Metadata } from "next";
import "./globals.css";
import RTLProvider from "@/components/RTLProvider";
import { generateOrganizationJsonLd } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://asociacionanae.org'),
    title: "ANAE - Asociación Nacional de Argelinos en España",
    description: "La Asociación Nacional de Argelinos en España (ANAE) trabaja incansablemente para construir puentes de esperanza, empoderar a las personas y crear cambios duraderos en nuestras comunidades.",
    keywords: ["ANAE", "Asociación", "Argelinos", "España", "Cultura", "Comunidad", "Zaragoza", "Integración", "Mediación sociocultural"],
    authors: [{ name: "ANAE" }],
    creator: "ANAE",
    publisher: "ANAE",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/images/logos/logo_color.svg', type: 'image/svg+xml' },
        ],
        apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    category: 'organization',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const organizationJsonLd = generateOrganizationJsonLd();

    return (
        <html suppressHydrationWarning>
            <head>
                {/* Set RTL/LTR direction before React hydrates to prevent flash */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const pathname = window.location.pathname;
                                const localeMatch = pathname.match(/^\\/(ar|es|fr|en)(\\/|$)/);
                                const locale = localeMatch ? localeMatch[1] : 'es';
                                const isRTL = locale === 'ar';
                                document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                                document.documentElement.lang = locale;
                            })();
                        `,
                    }}
                />
                {/* JSON-LD pour l'organisation */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationJsonLd),
                    }}
                />
                {/* Google Consent Mode v2 Default Settings */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('consent', 'default', {
                                'ad_storage': 'denied',
                                'analytics_storage': 'denied',
                                'ad_user_data': 'denied',
                                'ad_personalization': 'denied',
                            });
                        `,
                    }}
                />
            </head>
            <body>
                <RTLProvider>
                    {children}
                </RTLProvider>
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
            </body>
        </html>
    );
}
