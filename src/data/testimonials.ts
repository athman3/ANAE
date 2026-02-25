export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  lang: 'fr' | 'ar' | 'es' | 'en';
  dir: 'ltr' | 'rtl';
}

export const communityTestimonials: Testimonial[] = [
  {
    quote: "Grâce à l'ANAE, j'ai pu accomplir mes démarches de résidence et trouver une communauté accueillante à mon arrivée en Espagne. Leur soutien a changé ma vie.",
    name: "Karim B.",
    role: "Membre de la communauté depuis 2022",
    lang: "fr",
    dir: "ltr"
  },
  {
    quote: "إفطار رمضان الذي نظمته ANAE كان لحظة تضامن لا تُنسى. ذكّرني بالوطن وأظهر لي أن الناس يهتمون حقًا.",
    name: "فاطمة ز.",
    role: "مستفيدة من الإفطار",
    lang: "ar",
    dir: "rtl"
  },
  {
    quote: "Los eventos culturales de ANAE ayudaron a mis hijos a mantenerse conectados con sus raíces argelinas mientras crecían en España. Estamos agradecidos por su trabajo.",
    name: "Mohamed A.",
    role: "Padre y voluntario",
    lang: "es",
    dir: "ltr"
  },
  
];
