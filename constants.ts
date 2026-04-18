export const STORE_NAME = "Peques";
export const USE_GOOGLE_SHEET = true;
export const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpfkjkJRniDN2OSqMCG_F8oodwCazJQZWJCW0yy8AtMqkBrh2a_9KC-Qml2r9CgyYImWNCDnW1i0o_/pub?gid=0&single=true&output=csv";
export const PHONE_NUMBER = "59173666713";
export const CURRENCY = "Bs.";

// Colors
export const PRIMARY_COLOR_HEX = "#2DD4BF";
export const PRIMARY_CONTENT_HEX = "#475569"; // Slate-600 - un gris azulado claramente no negro
export const SECONDARY_COLOR_HEX = "#3B82F6";
export const TITLE_COLOR_HEX = "#111827";

// Assets
export const LOGO_URL = "https://pequesmiboutique.com/img/upload/comercios/logos/1930294829_logo-peques-DEF02.png";
export const IMAGE_ASPECT_RATIO = "aspect-[10/9]";
export const IMAGE_VERTICAL_ALIGN = "20%";

// Typography
export const TITLE_FONT_FAMILY = "system-ui, -apple-system, sans-serif";

// Mock Data (Fallback)
export const MOCK_PRODUCTS = [
  {
    id: 101,
    nombre: "Vestido de Fiesta Rosa",
    precio: 320,
    categoria: "Fiesta;Blancos",
    imagen: "https://images.pexels.com/photos/1036068/pexels-photo-1036068.jpeg?auto=compress&cs=tinysrgb&w=300",
    stock: 15,
    descripcion: "Elegante vestido de organza para eventos especiales, con detalles de encaje y vuelo.",
    tallas: "S;M;L;XL",
    color: "Rosa"
  },
  {
    id: 107,
    nombre: "Vestido de Gala Azul Noche",
    precio: 450,
    categoria: "Fiesta",
    imagen: "https://images.pexels.com/photos/1036074/pexels-photo-1036074.jpeg?auto=compress&cs=tinysrgb&w=300",
    stock: 7,
    descripcion: "Vestido largo de satín con hombros descubiertos, ideal para adolescentes, con mucha caída.",
    tallas: "XS;S;M",
    color: "Azul Marino"
  },
  {
    id: 108,
    nombre: "Vestido Corto con Lentejuelas",
    precio: 290,
    categoria: "Fiesta",
    imagen: "https://images.pexels.com/photos/1036078/pexels-photo-1036078.jpeg?auto=compress&cs=tinysrgb&w=300",
    stock: 10,
    descripcion: "Diseño moderno, perfecto para cumpleaños y celebraciones juveniles. Es ligero y cómodo.",
    tallas: "M;L;XL",
    color: "Oro"
  },
];