import { useMemo } from 'react';
import { MaintenanceType } from '../models/MaintenanceType';
import maintenanceIcon from '../assets/engine-oil.png';
import tireIcon from '../assets/wheel.png';
import revisionIcon from '../assets/car-repair.png';
import genericCarIcon from '../assets/car.png';

export const useMaintenanceCardIcon = (maintenanceType: MaintenanceType) => {
  return useMemo(() => {
    switch (maintenanceType) {
      case 'Tagliando':
        return maintenanceIcon;
      case 'Gomme':
        return tireIcon;
      case 'Revisione':
        return revisionIcon;
      default:
        return genericCarIcon;
    }
  }, [maintenanceType]);
};
