
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceType } from '../models/MaintenanceType';

import tagliandoImg from '../assets/engine-oil.png';
import tireImg from '../assets/wheel.png';
import repairImg from '../assets/car-repair.png';
import carImg from '../assets/car.png';

export const getDateString = () => {
    return new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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