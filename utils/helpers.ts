export const normalizeString = (str: string): string => {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, 'n');
};

export const uniqueCartId = (productId: number, size: string): string => `${productId}-${size}`;

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const parseCSVLine = (line: string): string[] => {
  const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
  let match;
  const fields = [];
  while ((match = regex.exec(line)) !== null) {
      let field = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      if (field === undefined) field = ''; 
      fields.push(field.trim());
      if (match.index === line.length) break;
  }
  return fields;
};

export const createSlug = (name: string): string => {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-');
};