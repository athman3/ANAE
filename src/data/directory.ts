export type ResourceType = 'website' | 'app' | 'place' | 'article' | 'document' | 'service' | 'phone';

export interface DirectoryResource {
  id: string;
  categoryId: string;
  type: ResourceType;
  url?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  blogSlug?: string;
  facebook?: string;
}

export interface DirectoryCategory {
  id: string;
  icon: string;
}

export const CATEGORIES: DirectoryCategory[] = [
  { id: 'consulates',        icon: 'Landmark' },
  { id: 'immigration',       icon: 'FileText' },
  { id: 'language-learning', icon: 'Languages' },
  { id: 'employment',        icon: 'Briefcase' },
  { id: 'housing',           icon: 'Home' },
  { id: 'legal-aid',         icon: 'Scale' },
  { id: 'health',            icon: 'HeartPulse' },
  { id: 'education',         icon: 'GraduationCap' },
  { id: 'transport',         icon: 'Plane' },
  { id: 'associations',      icon: 'HandHeart' },
  { id: 'made-by-algerians', icon: 'Users' },
  { id: 'banking',           icon: 'Building2' },
];

export const RESOURCES: DirectoryResource[] = [

  // ── Consulates ────────────────────────────────────────────────────────────
  {
    id: 'consular-services-guide',
    categoryId: 'consulates',
    type: 'article',
    blogSlug: 'consular-services-algeria-spain',
  },
  {
    id: 'embassy-madrid',
    categoryId: 'consulates',
    type: 'place',
    url: 'http://www.emb-argelia.es',
    phone: '+34 915 629 705',
    email: 'servicioconsular@emb-argelia.es',
    facebook: 'https://www.facebook.com/EmbjadaArgeliaMadrid/',
    address: 'Calle del General Oraá, 12',
    city: 'Madrid',
  },
  {
    id: 'consulate-barcelona',
    categoryId: 'consulates',
    type: 'place',
    url: 'https://consulatalgerie-barcelone.org',
    phone: '+34 934 188 121',
    email: 'courrier@consulatdz-bcn.org',
    facebook: 'https://www.facebook.com/DZABCN',
    address: 'Av. del Tibidabo, 6, 08022 Barcelona',
    city: 'Barcelona',
  },
  {
    id: 'consulate-alicante',
    categoryId: 'consulates',
    type: 'place',
    url: 'https://www.consulalg.es/',
    phone: '+34 966 591 540',
    address: 'C/ Pintor Velázquez, 32, 03004 Alicante',
    city: 'Alicante',
  },
  // ── Language learning ─────────────────────────────────────────────────────
  {
    id: 'duolingo',
    categoryId: 'language-learning',
    type: 'app',
    url: 'https://www.duolingo.com',
  },
  {
    id: 'hellotalk',
    categoryId: 'language-learning',
    type: 'app',
    url: 'https://www.hellotalk.com',
  },

  // ── Associations algériennes en Espagne ───────────────────────────────────
  {
    id: 'anae',
    categoryId: 'associations',
    type: 'place',
    url: 'https://asociacionanae.org',
    email: 'contacto@asociacionanae.org',
    phone: '+34 674 748 699',
    facebook: 'https://www.facebook.com/profile.php?id=100069908903496',
  },

];

