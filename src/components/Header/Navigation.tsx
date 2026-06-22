"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useIsHomePage } from "@/lib/hooks/useIsHomePage";
import DonateButton from "@/components/ui/DonateButton";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { AssociationDropdown } from "./AssociationDropdown";
import { 
  getNavBackgroundClasses, 
  getNavTextClasses, 
  getNavLinkClasses, 
  getMobileMenuClasses,
  getMobileMenuItemClasses,
  getHamburgerButtonClasses
} from "@/lib/utils/navigationStyles";

interface NavigationProps {
    is404?: boolean;
}

export default function Navigation({ is404 = false }: NavigationProps) {
  const navigationLinks = ['home'];
  const navigationLinksAfter = ['contact', 'resources'];
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = useIsHomePage(is404);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  useEffect(() => {
    if (scrolled) {
      document.documentElement.setAttribute('data-scrolled', 'true');
    } else {
      document.documentElement.removeAttribute('data-scrolled');
    }
  }, [scrolled])

  const styleOptions = { is404, isHomePage, scrolled };

  return (
    <nav 
      className={`left-0 right-0 transition-all duration-300 z-[70] fixed ${scrolled || is404 ? 'top-0' : 'top-8'} ${getNavBackgroundClasses(styleOptions)}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className={`text-xl font-bold transition-colors duration-300 sm:text-2xl ${getNavTextClasses(styleOptions)}`}
          >
            ANAE
          </Link>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center justify-center space-x-6 rtl:space-x-reverse">
          {navigationLinks.map((link) => (
            <Link
              key={link}
              href={link === 'home' ? '/' : `/${link}`}
              className={`text-lg font-medium px-4 py-2 transition-all duration-300 hover:scale-[1.03] ${getNavLinkClasses(styleOptions)}`}
            >
              {t(link)}
            </Link>
          ))}
          <AssociationDropdown is404={is404} />
          {navigationLinksAfter.map((link) => (
            <Link
              key={link}
              href={link === 'home' ? '/' : `/${link}`}
              className={`text-lg font-medium px-4 py-2 transition-all duration-300 hover:scale-[1.03] ${getNavLinkClasses(styleOptions)}`}
            >
              {t(link)}
            </Link>
          ))}
        </div>

        {/* Right Side Actions - Always visible */}
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
          {/* Language Selector - Always visible */}
          <LanguageSelector scrolled={is404 ? true : scrolled} />
          
          {/* Hamburger Menu Button - Only visible on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1.5 rounded-md transition-colors duration-300 sm:p-2 ${getHamburgerButtonClasses(styleOptions)}`}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} className="sm:hidden" /> : <Menu size={20} className="sm:hidden" />}
            {mobileMenuOpen ? <X size={24} className="hidden sm:block" /> : <Menu size={24} className="hidden sm:block" />}
          </button>
          
          {/* Donate Button - Always visible */}
          <DonateButton />
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {mobileMenuOpen && (
        <div className={`lg:hidden transition-all duration-300 backdrop-blur-sm ${getMobileMenuClasses(styleOptions)}`}>
          <div className="px-4 py-3 space-y-1 sm:px-5 sm:py-4 sm:space-y-2">
            {/* Home */}
            {navigationLinks.map((link) => (
              <Link
                key={link}
                href={link === 'home' ? '/' : `/${link}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:scale-[1.02] sm:text-lg sm:px-4 sm:py-3 ${getMobileMenuItemClasses(styleOptions)}`}
              >
                {t(link)}
              </Link>
            ))}
            
            {/* Association submenu */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:scale-[1.02] sm:text-lg sm:px-4 sm:py-3 ${getMobileMenuItemClasses(styleOptions)}`}
            >
              {t('association.about')}
            </Link>
            <Link
              href="/about/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:scale-[1.02] sm:text-lg sm:px-4 sm:py-3 ${getMobileMenuItemClasses(styleOptions)}`}
            >
              {t('association.gallery')}
            </Link>
            <Link
              href="/contribute"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:scale-[1.02] sm:text-lg sm:px-4 sm:py-3 ${getMobileMenuItemClasses(styleOptions)}`}
            >
              {t('association.contribute')}
            </Link>

            {/* Contact & Resources */}
            {navigationLinksAfter.map((link) => (
              <Link
                key={link}
                href={link === 'home' ? '/' : `/${link}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium px-3 py-2 rounded-md transition-all duration-300 hover:scale-[1.02] sm:text-lg sm:px-4 sm:py-3 ${getMobileMenuItemClasses(styleOptions)}`}
              >
                {t(link)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}