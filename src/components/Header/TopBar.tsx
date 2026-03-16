"use client"

import { useState, useEffect } from "react"
import { usePathname, useParams } from "next/navigation"
import { Link, useRouter } from "@/i18n/navigation"
import { IconPhone, IconMail, IconMapPin } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { SOCIAL_LINKS } from "@/lib/constants/socialLinks"

import arMessages from "../../../messages/ar.json"
import esMessages from "../../../messages/es.json"
import frMessages from "../../../messages/fr.json"
import enMessages from "../../../messages/en.json"

const languages = [
  { code: 'ar', name: arMessages.language.name, flag: arMessages.language.flag },
  { code: 'es', name: esMessages.language.name, flag: esMessages.language.flag },
  { code: 'fr', name: frMessages.language.name, flag: frMessages.language.flag },
  { code: 'en', name: enMessages.language.name, flag: enMessages.language.flag },
]

const SocialLinks = () => {
  const pathname = usePathname()
  const isRTL = pathname.startsWith('/ar')

  const socialLinks = isRTL ? [...SOCIAL_LINKS].reverse() : SOCIAL_LINKS

  return (
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      {socialLinks.map(({ href, icon: Icon, label, hoverColor }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-slate-100 ${hoverColor} hover:scale-110 transition-all duration-200`}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Link>
      ))}
    </div>
  )
}

const ContactInfo = ({ t }: { t: (key: string) => string }) => {
  const contactItems = [
    { icon: IconPhone, text: "+34 674 748 699", className: "hidden sm:flex", dir: "ltr" },
    { icon: IconMail, text: "contacto@asociacionanae.org", className: "hidden lg:flex", dir: "ltr" },
    { icon: IconMapPin, text: `${t("city")}, ${t("country")}`, className: "hidden md:flex" },
  ]

  return (
    <>
      {contactItems.map(({ icon: Icon, text, className, dir }, index) => (
        <div key={index} className={`${className} items-center gap-2 rtl:flex-row-reverse`} dir="ltr">
          <Icon className="h-4 w-4 shrink-0" />
          <span dir={dir}>{text}</span>
        </div>
      ))}
    </>
  )
}

const LanguageFlags = () => {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  let currentLocale = params.locale as string
  if (!currentLocale) {
    const segments = pathname.split('/')
    const possible = segments[1]
    currentLocale = languages.some(l => l.code === possible) ? possible : 'es'
  }

  const handleLanguageChange = (locale: string) => {
    if (locale === currentLocale) return
    const segments = pathname.split('/')
    const pathWithoutLocale = segments.slice(2).join('/')
    router.push(`/${pathWithoutLocale}`, { locale })
  }

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      {languages.map(({ code, flag, name }) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code)}
          aria-label={name}
          title={name}
          className={`text-base leading-none transition-all duration-200 cursor-pointer hover:scale-110 ${
            currentLocale === code ? 'scale-110' : ''
          }`}
        >
          {flag}
        </button>
      ))}
    </div>
  )
}

export default function TopBar() {
  const t = useTranslations("location")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  return (
    <div id="topbar" className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-1.5 px-6 text-sm fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${
      scrolled ? "transform -translate-y-full opacity-0" : "transform translate-y-0 opacity-100"
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <SocialLinks />
          <span className="hidden sm:inline">|</span>
          <ContactInfo t={t} />
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link className="hidden sm:inline" href="/faq">
            FAQ
          </Link>
          <span className="hidden sm:inline">|</span>
          <LanguageFlags />
        </div>
      </div>
    </div>
  )
}
