import { v4 as uuidv4 } from 'uuid';


export const getDateString = (date?: Date) => {
  const d = date || new Date();
  return d.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}


export const parseStringToDate = (dateStr: string): Date => {
    // Prova prima il formato "DD/MM/YY"
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/').map(Number);
        const fullYear = year < 100 ? 2000 + year : year;
        return new Date(fullYear, month - 1, day);
    }
    
    // Gestisce il formato "DD MMM YYYY" (es: "10 mag 2025")
    const months: { [key: string]: number } = {
        'gen': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mag': 4, 'giu': 5,
        'lug': 6, 'ago': 7, 'set': 8, 'ott': 9, 'nov': 10, 'dic': 11
    };
    
    const [day, monthStr, year] = dateStr.split(' ');
    const month = months[monthStr.toLowerCase()];
    
    if (month === undefined) {
        throw new Error('Formato data non valido');
    }
    
    return new Date(parseInt(year), month, parseInt(day));
}

export const getMaintenanceKey = () => {
  return 'mnt-';
}

export const getUUIDKey = () => {
  // return 'mnt-' + Date.now();
  return getMaintenanceKey() + uuidv4();
}

/**
 * Converte una stringa numerica in formato italiano (con virgola) in un numero
 * @param value - La stringa da convertire (es: "78,30" o "78.30")
 * @returns Il numero convertito o 0 se la conversione fallisce
 */
export const parseItalianNumber = (value: string | number): number => {
  if (typeof value === 'number') {
    return value;
  }
  
  if (!value || typeof value !== 'string') {
    return 0;
  }
  
  // Rimuove spazi e sostituisce la virgola con il punto
  const normalizedValue = value.toString().trim().replace(',', '.');
  
  // Converte a numero
  const result = parseFloat(normalizedValue);
  
  // Restituisce 0 se la conversione fallisce
  return isNaN(result) ? 0 : result;
}
