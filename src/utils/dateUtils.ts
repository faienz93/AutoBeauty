


/**
 * Returns a formatted date string in the 'it-IT' locale.
 *
 * If no date is provided, the current date is used.
 * The returned string includes the year (numeric), month (short), and day (numeric).
 *
 * @param date - Optional `Date` object to format. Defaults to the current date if not provided.
 * @returns The formatted date string in 'it-IT' locale.
 */
export const getDateString = (date?: Date) => {
  const d = date || new Date();
  return d.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}


/**
 * Parses a date string in either "DD/MM/YY" or "DD MMM YYYY" format and returns a JavaScript Date object.
 *
 * - For "DD/MM/YY", the year is interpreted as 2000 + YY if YY < 100.
 * - For "DD MMM YYYY", the month must be in Italian short form (e.g., "mag" for May).
 *
 * @param dateStr - The date string to parse.
 * @returns A Date object representing the parsed date.
 * @throws {Error} If the date string format is invalid or the month is not recognized.
 *
 * @example
 * ```typescript
 * parseStringToDate("10/05/25"); // May 10, 2025
 * parseStringToDate("10 mag 2025"); // May 10, 2025
 * ```
 */
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
