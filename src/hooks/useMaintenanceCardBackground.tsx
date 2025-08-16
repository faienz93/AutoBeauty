import { useMemo } from 'react';
import { MaintenanceType } from '../models/MaintenanceType';
import carWorkshop from '../assets/car-workshop-unsplash.jpg';

// Revision
import carRevision from '../assets/car-revision-unsplash.jpg';
import carMaintenance from '../assets/car-maintenance-unsplash.jpg';
import tyreMaintenance from '../assets/tire-maintenance-unsplash.jpg';

export const useMaintenanceCardBackground = (maintenanceType: MaintenanceType) => {
  return useMemo(() => {
    switch (maintenanceType) {
      case 'Tagliando':
        return carMaintenance;
      case 'Gomme':
        return tyreMaintenance;
      case 'Revisione':
        return carWorkshop;
      default:
        return carRevision;
    }
  }, [maintenanceType]);
};
