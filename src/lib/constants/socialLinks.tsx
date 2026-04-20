import type { ComponentType } from "react";
import {
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandTiktok,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export interface SocialLink {
  href: string;
  icon: ComponentType<{ className?: string }>;
  hoverColor: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://www.facebook.com/profile.php?id=100069908903496",
    icon: IconBrandFacebook,
    hoverColor: "hover:text-blue-500",
    label: "Facebook"
  },
  {
    href: "https://www.youtube.com/@anae_asociacion",
    icon: IconBrandYoutube,
    hoverColor: "hover:text-red-400",
    label: "YouTube"
  },
  {
    href: "https://www.instagram.com/anae_asociacion/",
    icon: IconBrandInstagram,
    hoverColor: "hover:text-pink-500",
    label: "Instagram"
  },
  {
    href: "https://www.tiktok.com/@anae_asociacion",
    icon: IconBrandTiktok,
    hoverColor: "hover:text-[#69C9D0]",
    label: "TikTok"
  },
  {
    href: "https://www.linkedin.com/company/anae-asociacion/",
    icon: IconBrandLinkedin,
    hoverColor: "hover:text-blue-600",
    label: "LinkedIn"
  },
  {
    href: "https://wa.me/34674748699",
    icon: IconBrandWhatsapp,
    hoverColor: "hover:text-emerald-400",
    label: "WhatsApp"
  }
];

export const CONTACT_INFO = {
  phone: "+34 674 748 699",
  email: "contacto@asociacionanae.org",
  github: "https://github.com/ATHman3/ANAE"
};
