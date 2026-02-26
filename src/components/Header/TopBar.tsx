"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { IconPhone, IconMail, IconMapPin, IconBrandGithubFilled, IconStarFilled } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { SOCIAL_LINKS } from "@/lib/constants/socialLinks"

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
    {
      icon: IconPhone,
      text: "+34 674 748 699",
      className: "hidden sm:flex",
      dir: "ltr"
    },
    {
      icon: IconMail,
      text: "contacto@asociacionanae.org",
      className: "hidden lg:flex",
      dir: "ltr"
    },
    {
      icon: IconMapPin,
      text: `${t("city")}, ${t("country")}`,
      className: "hidden md:flex"
    }
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

const GitHubLink = () => {
  const pathname = usePathname()
  const isRTL = pathname.startsWith('/ar')
  const [stars, setStars] = useState<number | null>(null)
  
  useEffect(() => {
    // Charger immédiatement depuis le cache (même expiré)
    const cached = localStorage.getItem('github-stars')
    if (cached) {
      try {
        const { value, timestamp } = JSON.parse(cached)
        // Afficher la valeur du cache immédiatement
        setStars(value)
        
        // Vérifier si le cache est encore valide (1 heure)
        if (Date.now() - timestamp < 3600000) {
          // Cache valide, mais fetch quand même en arrière-plan pour garder à jour
          fetch('https://api.github.com/repos/ATHman3/ANAE')
            .then(res => res.json())
            .then(data => {
              const count = data.stargazers_count
              if (count !== value) {
                setStars(count)
              }
              localStorage.setItem('github-stars', JSON.stringify({
                value: count,
                timestamp: Date.now()
              }))
            })
            .catch(() => {})
          return
        }
      } catch {
        // Cache invalide, continuer avec fetch
      }
    }
    
    // Pas de cache ou cache expiré, fetch directement
    fetch('https://api.github.com/repos/ATHman3/ANAE')
      .then(res => res.json())
      .then(data => {
        const count = data.stargazers_count
        setStars(count)
        localStorage.setItem('github-stars', JSON.stringify({
          value: count,
          timestamp: Date.now()
        }))
      })
      .catch(() => {
        // En cas d'erreur, mettre 0 si pas de valeur
        setStars(prevStars => prevStars === null ? 0 : prevStars)
      })
  }, []) // stars n'est pas nécessaire ici car on utilise prevStars dans le setter
  
  return (
    <Link
      href="https://github.com/ATHman3/ANAE"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 rtl:space-x-reverse px-3 my-1"
    >
          {isRTL ? (
        <>
          {/* Stars section - first in RTL */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            
            <span className="text-xs font-medium mt-0.5">{stars ?? ''}</span>
            <IconStarFilled className="h-3 w-3 text-yellow-400" />
          </div>
          {/* GitHub section - second in RTL, icon always left of text */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            
            <span className="text-xs font-medium mt-0.5">GitHub</span>
            <IconBrandGithubFilled className="h-5 w-5" />
          </div>
        </>
      ) : (
        <>
          {/* GitHub section - first in LTR, icon always left of text */}
          <div className="flex items-center space-x-2">
            <IconBrandGithubFilled className="h-5 w-5" />
            <span className="text-xs font-medium mt-0.5">GitHub</span>
          </div>
          {/* Stars section - second in LTR */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <IconStarFilled className="h-3 w-3 text-yellow-400" />
            <span className="text-xs font-medium mt-0.5">{stars ?? ''}</span>
          </div>
        </>
      )}
    </Link>
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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-1 px-6 text-sm fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${
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
          <GitHubLink />
        </div>
      </div>
    </div>
  )
}