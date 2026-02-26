"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

export default function CookieBanner() {
    const t = useTranslations("cookieBanner");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent was already given
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            setIsVisible(true);
        } else if (consent === "granted") {
            // Re-apply granted status on subsequent page loads if previously granted
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
                window.gtag("consent", "update", {
                    analytics_storage: "granted",
                    ad_storage: "granted",
                    ad_user_data: "granted",
                    ad_personalization: "granted",
                });
            }
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "granted");
        setIsVisible(false);
        
        // Update Google Consent Mode
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: "granted",
                ad_storage: "granted",
                ad_user_data: "granted",
                ad_personalization: "granted",
            });
        }
    };

    const rejectCookies = () => {
        localStorage.setItem("cookie_consent", "denied");
        setIsVisible(false);
        // Google Consent Mode remains denied (default)
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 bg-background border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-foreground/80 max-w-4xl rtl:text-right text-left">
                {t("message")}{" "}
                <Link href="/cookies" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    {t("policy")}
                </Link>
            </div>
            <div className="flex items-center gap-3 shrink-0 rtl:space-x-reverse w-full sm:w-auto">
                <Button variant="outline" onClick={rejectCookies} className="flex-1 sm:flex-none">
                    {t("reject")}
                </Button>
                <Button onClick={acceptCookies} className="flex-1 sm:flex-none">
                    {t("accept")}
                </Button>
            </div>
        </div>
    );
}
