// data/products.js — Kilbourn product catalog (ES module)

export const WA_NUMBER = "5491127719845";
export const EMAIL     = "kilbourn@gmail.com";
export const INSTAGRAM = "kilbournave";
export const TIKTOK    = "kilbournave";
export const BASE      = "Buenos Aires, Argentina";

export const products = [
  {
    id: "kilbourn-tee-001",
    slug: "kilbourn-tee-001",
    name: "Kilbourn Tee 001",
    label: "Drop 001",
    category: "remeras",
    status: "published",
    price: 32000,
    currency: "ARS",
    description: "Remera base del Drop 001. Pieza urbana de lectura limpia, pensada como uniforme gráfico de avenida.",
    details: "100% algodón peinado 220g. Corte oversize. Cuello acanalado. Estampa serigrafiada.",
    image: "assets/logos/kb-monogram.svg",
    alt: "Kilbourn Tee 001",
    sizes: ["S","M","L","XL","XXL"],
    featured: true,
    keywords: ["remera","tee","001","drop","kb"]
  },
  {
    id: "west-ave-tee",
    slug: "west-ave-tee",
    name: "West Ave Tee",
    label: "Drop 001",
    category: "remeras",
    status: "published",
    price: 35000,
    currency: "ARS",
    description: "Pieza signature con el universo West Kilbourn Ave. Gráfica editorial, presencia de avenida.",
    details: "100% algodón peinado 220g. Corte oversize. Estampa serigrafiada.",
    image: "assets/logos/kilbourn-logo.svg",
    alt: "West Ave Tee — Kilbourn",
    sizes: ["S","M","L","XL"],
    featured: true,
    keywords: ["remera","tee","west","ave","kilbourn","signature"]
  },
  {
    id: "archive-tee",
    slug: "archive-tee",
    name: "Archive Tee",
    label: "Drop 001",
    category: "remeras",
    status: "published",
    price: 33000,
    currency: "ARS",
    description: "Lenguaje de archivo urbano. Reminiscencias de cartel, señalética de calle y cultura visual.",
    details: "100% algodón peinado 220g. Corte regular. Estampa DTG alta definición.",
    image: "assets/logos/kb-monogram.svg",
    alt: "Archive Tee — Kilbourn",
    sizes: ["M","L","XL"],
    featured: false,
    keywords: ["remera","tee","archive","urbano","calle"]
  },
  {
    id: "kb-archive-hoodie",
    slug: "kb-archive-hoodie",
    name: "KB Archive Hoodie",
    label: "Próximamente",
    category: "hoodies",
    status: "coming_soon",
    price: 0,
    currency: "ARS",
    description: "Próximo drop. Hoodie oversize con lenguaje de archivo y energía vintage. Pieza de temporada.",
    details: "Próximamente disponible. Anotate para recibir aviso.",
    image: "assets/logos/kb-monogram.svg",
    alt: "KB Archive Hoodie — próximo drop Kilbourn",
    sizes: [],
    featured: true,
    keywords: ["hoodie","archive","kb","proximo","drop"]
  },
  {
    id: "drop-001-sample",
    slug: "drop-001-sample",
    name: "Drop 001 Sample",
    label: "Preview",
    category: "remeras",
    status: "preview",
    price: 38000,
    currency: "ARS",
    description: "Pieza de muestra del primer drop. Unidades muy limitadas. Consultar disponibilidad directa.",
    details: "100% algodón peinado 240g. Pieza de edición limitada numerada.",
    image: "assets/logos/kilbourn-logo.svg",
    alt: "Drop 001 Sample — Kilbourn edición limitada",
    sizes: ["M","L"],
    featured: false,
    keywords: ["sample","drop","001","limitado","preview","numerado"]
  },
  {
    id: "avenue-tee",
    slug: "avenue-tee",
    name: "Avenue Tee",
    label: "Drop 001",
    category: "remeras",
    status: "published",
    price: 34000,
    currency: "ARS",
    description: "Pieza con gráfica editorial inspirada en señalética de avenida. Pulso urbano y archivo visual.",
    details: "100% algodón peinado 220g. Corte oversize. Estampa serigrafiada.",
    image: "assets/logos/kb-monogram.svg",
    alt: "Avenue Tee — Kilbourn",
    sizes: ["S","M","L","XL"],
    featured: false,
    keywords: ["remera","tee","avenue","avenida","calle"]
  }
];

export const STATUS_LABEL = {
  published: "Disponible",
  preview: "Preview",
  coming_soon: "Próximamente",
  sold_out: "Agotado"
};

export function formatPrice(value){
  if(!value) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function findProduct(slug){
  return products.find(p => p.slug === slug || p.id === slug);
}

export function relatedProducts(slug, limit = 3){
  const current = findProduct(slug);
  if(!current) return [];
  return products
    .filter(p => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
