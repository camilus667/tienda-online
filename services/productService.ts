import { Product } from '../types';
import { MOCK_PRODUCTS, USE_GOOGLE_SHEET, SHEET_URL } from '../constants';
import { normalizeString, parseCSVLine } from '../utils/helpers';

const processRawValue = (val: string, key: string): any => {
    if (key === 'precio' || key === 'stock' || key === 'id') {
        return Number(val) || 0;
    }
    if ((key === 'tallas' || key === 'categoria') && typeof val === 'string') {
        return val.split(';').map(s => s.trim()).filter(s => s.length > 0);
    }
    return val;
};

const csvToJson = (csvText: string): Product[] => {
  const lines = csvText.split("\n").filter(line => line.trim() !== '');
  if (lines.length < 1) return [];

  const rawHeaders = parseCSVLine(lines[0]);
  const normalizedHeaders = rawHeaders.map(h => normalizeString(h));
  const expectedHeaders = ['id', 'nombre', 'precio', 'categoria', 'imagen', 'stock', 'descripcion', 'tallas', 'color', 'imagenes_adicionales'];

  const headerMap: Record<number, string> = {};
  normalizedHeaders.forEach((normalizedHeader, index) => {
      const match = expectedHeaders.find(expected => expected === normalizedHeader);
      if (match) headerMap[index] = match;
  });

  const result: Product[] = [];
  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentline = parseCSVLine(lines[i]);
    if (currentline.length < rawHeaders.length) continue; 
    
    rawHeaders.forEach((_, index) => {
        const expectedName = headerMap[index];
        if (!expectedName || index >= currentline.length) return; 
        
        let val = currentline[index] || ""; 
        obj[expectedName] = processRawValue(val, expectedName);
    });

    if (obj.nombre && obj.precio > 0 && obj.categoria && obj.categoria.length > 0) {
        result.push(obj as Product);
    }
  }
  return result;
};

const mockToProduct = (mock: any): Product => {
    return {
        ...mock,
        categoria: typeof mock.categoria === 'string' ? mock.categoria.split(';') : mock.categoria,
        tallas: typeof mock.tallas === 'string' ? mock.tallas.split(';') : mock.tallas
    };
};

export const fetchProducts = async (retries = 3): Promise<Product[]> => {
    if (!USE_GOOGLE_SHEET || !SHEET_URL) {
        return MOCK_PRODUCTS.map(mockToProduct);
    }

    const cacheBusterUrl = `${SHEET_URL}&t=${new Date().getTime()}`; 
    try {
        const response = await fetch(cacheBusterUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const csvText = await response.text();
        const parsed = csvToJson(csvText);
        if (parsed.length === 0) throw new Error("La hoja no contiene productos válidos.");
        return parsed;
    } catch (e: any) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return fetchProducts(retries - 1);
        }
        console.warn("Falling back to mock data due to error:", e);
        // Fallback to mock data if fetch fails after retries
        return MOCK_PRODUCTS.map(mockToProduct);
    }
};