"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { 
    Mail, 
    Phone, 
    MapPin,
    Heart
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants/socialLinks";

export default function Footer() {
    const t = useTranslations("footer");
    const pathname = usePathname();
    const isRTL = pathname.startsWith('/ar');
    
    // En RTL, on inverse l'ordre pour que l'ordre visuel reste : Facebook, YouTube, Instagram, WhatsApp
    const socialLinks = isRTL ? [...SOCIAL_LINKS].reverse() : SOCIAL_LINKS;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Organization Info */}
                    <div className="lg:col-span-1 flex flex-col">
                        <div className="flex items-center gap-2 rtl:ml-auto w-fit mb-4">
                            <Heart className="h-8 w-8 text-red-500" />
                            <h3 className="text-xl font-bold">ANAE</h3>
                        </div>
                        <p className="text-gray-300 mb-4 text-sm">
                            {t("description")}
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map(({ href, icon: Icon, label }) => (
                                <a 
                                    key={label}
                                    href={href} 
                                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t("quickLinks.title")}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    {t("quickLinks.about")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    {t("quickLinks.events")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    {t("quickLinks.blog")} & {t("quickLinks.news")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    {t("quickLinks.faq")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t("contact.title")}</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        {t("contact.address")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <a 
                                    href="tel:+34674748699" 
                                    className="text-gray-300 hover:text-white transition-colors text-sm"
                                    dir="ltr"
                                >
                                    +34 674 748 699
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <a 
                                    href="mailto:contacto@asociacionanae.org" 
                                    className="text-gray-300 hover:text-white transition-colors text-sm"
                                    dir="ltr"
                                >
                                    contacto@asociacionanae.org
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Legal & Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t("legal.title")}</h4>
                        <ul className="space-y-2 mb-6">
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    {t("legal.privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    {t("legal.cookies")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-950 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>جميع الحقوق محفوظة</span>
                            <span className="hidden lg:inline">-</span>
                            <span>© {currentYear} ANAE</span>
                        </div>
                        
                        {/* Developer Credit - Centered */}
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-400">
                            <span className="text-lg rtl:mr-1">🇩🇿</span>
                            <span>
                                {t("developedBy")}{" "}
                                <a 
                                    href="https://github.com/ATHman3" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-500 hover:text-green-400 transition-colors"
                                >
                                    ATHman3
                                </a>
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-400">
                            <span>{t("registration")}</span>
                            <span>•</span>
                            <span>{t("taxId")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
