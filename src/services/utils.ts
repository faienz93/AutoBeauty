
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceType } from '../models/MaintenanceType';

import tagliandoImg from '../assets/engine-oil.png';
import tireImg from '../assets/wheel.png';
import repairImg from '../assets/car-repair.png';
import carImg from '../assets/car.png';

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


export const getMaintenanceIcon = (type: MaintenanceType): string => {
    switch (type) {
      case 'Tagliando':
        return tagliandoImg;
      case 'Gomme':
        return tireImg;
      case 'Revisione':
        return repairImg;
      default:
        return carImg;
    }
  };