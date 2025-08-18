import { Maintenance, Stats } from '../types/MaintenanceType';
import { getStringToDate } from './dateUtils';
import { v4 as uuidv4 } from 'uuid';

const MaintenanceLimit = 15000; // limite gomme
const TyreLimit = 10000; // limite tagliando

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

export function isMaintenanceNeeded(maintenanceType: string, diffKm: number, maintenanceDate: string) {
  let maintenanceNeeded = false;
  if (maintenanceType === 'Gomme') maintenanceNeeded = diffKm >= TyreLimit;
  if (maintenanceType === 'Tagliando') maintenanceNeeded = diffKm >= MaintenanceLimit;
  if (maintenanceType === 'Revisione') {
    const dateLastRevision = getStringToDate(maintenanceDate);
    const today = new Date();
    const pastMonths = (today.getFullYear() - dateLastRevision.getFullYear()) * 12 + (today.getMonth() - dateLastRevision.getMonth());

    maintenanceNeeded = pastMonths >= 24; // 24 mesi = 2 anni
  }
  return maintenanceNeeded;
}

export const formatCost = (value: string): string => {
  return value.replace('.', ',');
};
