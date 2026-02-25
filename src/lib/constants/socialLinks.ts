import { 
  Facebook, 
  Youtube, 
  Instagram, 
  MessageCircle,
  LucideIcon 
} from "lucide-react";

export interface SocialLink {
  href: string;
  icon: LucideIcon;
  hoverColor: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://www.facebook.com/profile.php?id=100069908903496",
    icon: Facebook,
    hoverColor: "hover:text-blue-500",
    label: "Facebook"
  },
  {
    href: "https://www.youtube.com/@anae_asociacion",
    icon: Youtube,
    hoverColor: "hover:text-red-400",
    label: "YouTube"
  },
  {
    href: "https://www.instagram.com/anae_asociacion/",
    icon: Instagram,
    hoverColor: "hover:text-pink-500",
    label: "Instagram"
  },
  {
    href: "https://wa.me/34674748699",
    icon: MessageCircle,
    hoverColor: "hover:text-emerald-400",
    label: "WhatsApp"
  }
];

export const CONTACT_INFO = {
  phone: "+34 674 748 699",
  email: "contacto@asociacionanae.org",
  github: "https://github.com/ATHman3/ANAE"
};
