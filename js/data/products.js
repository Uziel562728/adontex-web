// Shared Products Database and Slug Generator Helper
export const products = [
  {
    id: 1,
    name: "Remera Navy Classic",
    category: "remeras",
    price: "$12.500",
    desc: "Remera azul marino de corte regular, confeccionada en algodón peinado premium. Presenta un estampado geométrico minimalista en el pecho con tintas elásticas de alta durabilidad.",
    img: "assets/images/remera_navy_classic.jpg",
    tag: "Más Vendido",
    sizes: "S, M, L, XL, XXL",
    colors: "Azul Marino, Negro",
    fabric: "100% Algodón Peinado 24.1",
    care: "Lavar con agua fría del revés. No planchar sobre la estampa."
  },
  {
    id: 2,
    name: "Remera Urban White",
    category: "remeras",
    price: "$12.500",
    desc: "Remera blanca clásica de calce moderno. Confeccionada con algodón de tacto suave y fresco, luciendo una estampa abstracta de diseño propio en colores azules y celestes.",
    img: "assets/images/remera_urban_white.jpg",
    tag: "Nueva Temporada",
    sizes: "S, M, L, XL, XXL, XXXL",
    colors: "Blanco, Gris Claro",
    fabric: "100% Algodón Peinado 24.1",
    care: "Apta para lavarropas. Plancha media evitando la estampa."
  },
  {
    id: 3,
    name: "Remera Street Black",
    category: "remeras",
    price: "$13.200",
    desc: "Remera negra de corte street premium. Algodón pesado de excelente caída, con estampado de tecnología DTF digital en alta definición de estética neon-cyberpunk.",
    img: "assets/images/remera_street_black.jpg",
    tag: "Diseño Exclusivo",
    sizes: "M, L, XL, XXL",
    colors: "Negro",
    fabric: "100% Algodón Peinado Heavy",
    care: "Lavar a mano o lavado delicado. Centrifugado suave."
  },
  {
    id: 4,
    name: "Remera Custom Grey",
    category: "estampados",
    price: "$12.800",
    desc: "Remera gris melange de confección premium. Ideal para remeras promocionales o institucionales de alta gama con estampado de logo corporativo en tintas especiales.",
    img: "assets/images/remera_custom_grey.jpg",
    tag: "Destacado",
    sizes: "S, M, L, XL, XXL",
    colors: "Gris Melange, Negro, Marino",
    fabric: "Algodón 24.1 con Poliéster",
    care: "Lavar con colores similares. No usar secadora."
  },
  {
    id: 5,
    name: "Estampado Corporativo",
    category: "estampados",
    price: "Consultar",
    desc: "Servicio de confección y estampado textil por cantidad. Ideal para marcas de indumentaria, uniformes de empresas o eventos. Aplicamos serigrafía, DTF y vinilos especiales.",
    img: "assets/images/finished_products.jpg",
    tag: "Por Mayor",
    sizes: "Personalizado",
    colors: "Variedad a elección",
    fabric: "Algodón 24.1 / Piqué / Dry Fit",
    care: "Asesoramiento completo sobre el cuidado según la técnica elegida."
  },
  {
    id: 6,
    name: "Remera de Egresados",
    category: "estampados",
    price: "Consultar",
    desc: "Remeras y buzos de egresados personalizados. Diseños únicos a color completo creados a pedido para colegios y promociones escolares. Alta resistencia y costuras reforzadas.",
    img: "assets/images/tshirt_mockups.jpg",
    tag: "Promo Escolar",
    sizes: "Surtido Completo",
    colors: "Diseño multicolor",
    fabric: "Algodón Peinado Pesado",
    care: "Lavar con agua fría, jabón suave. Planchar a temperatura baja."
  }
];

// Helper to generate clean URL slug based on product name
export function getSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD") // Split tildes/accents into letter + combining marks
    .replace(/[\u0300-\u036f]/g, "") // Remove combining marks (accents)
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with single hyphens
}

// Helper to extract sizes list dynamically for sizing modules
export function getProductSizesList(product) {
  if (!product.sizes) return [];
  const list = product.sizes.split(',').map(s => s.trim());
  const genericTerms = ["personalizado", "surtido", "completo", "eleccion", "variedad"];
  
  if (list.length === 1 && genericTerms.some(term => list[0].toLowerCase().includes(term))) {
    return [];
  }
  return list;
}
