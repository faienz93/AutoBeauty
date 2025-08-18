import { Kilometers } from '../types/KilometersType';
import { Maintenance, Stats } from '../types/MaintenanceType';
import { getStringToDate } from './dateUtils';
import { v4 as uuidv4 } from 'uuid';

export const getMaintenanceKey = () => {
  return 'mnt-';
};

export const getUUIDKey = () => {
  // return 'mnt-' + Date.now();
  return getMaintenanceKey() + uuidv4();
};

export const getMaintenanceWithHigherKm = (maintenances: Maintenance[]): number => {
  if (maintenances.length === 0) return 0;

  // O(n)
  // const maintenaceWithHigherKm = maintenance.reduce(
  //   (acc, current) => {
  //     if (!acc || current.km > acc.km) {
  //       return current;
  //     }
  //     return acc;
  //   },
  //   null as Maintenance | null,
  // );

  // return maintenaceWithHigherKm;

  return maintenances.reduce((maxKm, m) => Math.max(maxKm, m.km), 0);
};

export const getGroupByMaintenanceByKm = (maintenance: Maintenance[]): Stats | null => {
  if (maintenance.length === 0) return {};

  const maintenanceGrouped = maintenance.reduce((acc, current) => {
    const existing = acc[current.tipo];

    // Se non esiste una manutenzione per questo tipo O
    // se la manutenzione corrente è più recente, aggiorna
    if (!existing || new Date(getStringToDate(current.data)).getTime() > new Date(getStringToDate(existing.data)).getTime()) {
      acc[current.tipo] = current;
    }

    return acc;
  }, {} as Stats);

  return maintenanceGrouped;
};

export const getMaxKmBetween = (lastManualKm: number, maxMaintenanceKm: number) => {
  if (lastManualKm > maxMaintenanceKm) return lastManualKm;
  return maxMaintenanceKm;
};
