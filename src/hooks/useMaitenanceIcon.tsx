import { useMemo } from 'react';
import { MaintenanceType } from '../models/MaintenanceType';
import tagliandoImg from '../assets/engine-oil.png';
import tireImg from '../assets/wheel.png';
import repairImg from '../assets/car-repair.png';
import carImg from '../assets/car.png';

export const useMaintenanceIcon = (type: MaintenanceType) => {
  return useMemo(() => {
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
  }, [type]);
};
