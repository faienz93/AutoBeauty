import { Maintenance, Stats } from '../types/MaintenanceType';
import { getStringToDate } from './dateUtils';
import { v4 as uuidv4 } from 'uuid';

const MaintenanceLimit = 15000; // limite tagliando
const TyreLimit = 10000; // limite gomme

/**
 * Returns the static key prefix for maintenance documents.
 * @returns The string 'mnt-'.
 */
export const getMaintenanceKey = () => {
  return 'mnt-';
};

/**
 * Generates a unique key for a maintenance document.
 * The key is composed of the maintenance prefix and a version 4 UUID.
 * @returns A unique string identifier.
 */
export const getUUIDKey = () => {
  // return 'mnt-' + Date.now();
  return getMaintenanceKey() + uuidv4();
};

/**
 * Finds the highest kilometer value from an array of maintenance records.
 * @param maintenances - An array of maintenance objects.
 * @returns The highest kilometer value, or 0 if the array is empty.
 */
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

/**
 * Groups maintenance records by type, keeping only the most recent one for each type.
 * The most recent record is determined by the maintenance date.
 * @param maintenance - An array of maintenance objects.
 * @returns An object grouping the latest maintenance records by type. Returns an empty object if the input is empty.
 */
export const getGroupByMaintenanceByKm = (maintenance: Maintenance[], maxBetweenManualAndHighestKm: number): Stats | null => {
  if (maintenance.length === 0) return {};

  const maintenanceGrouped = maintenance.reduce((acc, current) => {
    const existMaintenanceType = acc[current.tipo];

    // if Exist more recent maintenance, replace maintenance
    if (!existMaintenanceType || new Date(getStringToDate(current.data)).getTime() > new Date(getStringToDate(existMaintenanceType.data)).getTime()) {
      const diffKmForNextMaintenance = maxBetweenManualAndHighestKm - current.km;
      const isNeeded = isMaintenanceNeededFor(current.tipo, diffKmForNextMaintenance, current.data);
      acc[current.tipo] = { ...current, isNeeded };
    }

    return acc;
  }, {} as Stats);

  return maintenanceGrouped;
};

/**
 * Returns the greater of two kilometer values.
 * @param lastManualKm - The last manually entered kilometer reading.
 * @param maxMaintenanceKm - The highest kilometer reading from maintenance records.
 * @returns The higher of the two kilometer values.
 */
export const getMaxKmBetween = (lastManualKm: number, maxMaintenanceKm: number) => {
  if (lastManualKm > maxMaintenanceKm) return lastManualKm;
  return maxMaintenanceKm;
};

/**
 * Determines if a specific type of maintenance is needed.
 * - For 'Gomme' (Tyres), it checks if the kilometer difference exceeds `TyreLimit`.
 * - For 'Tagliando' (Service), it checks if the kilometer difference exceeds `MaintenanceLimit`.
 * - For 'Revisione' (Inspection), it checks if 24 months have passed since the last inspection.
 * @param maintenanceType - The type of maintenance to check.
 * @param diffKm - The kilometers driven since the last maintenance of the same type.
 * @param maintenanceDate - The date of the last maintenance (required for 'Revisione').
 * @returns `true` if maintenance is needed, `false` otherwise.
 */
export function isMaintenanceNeededFor(maintenanceType: string, diffKm: number, maintenanceDate: string) {
  let maintenanceNeeded = false;
  if (maintenanceType === 'Gomme') maintenanceNeeded = diffKm >= TyreLimit;
  if (maintenanceType === 'Tagliando')
    maintenanceNeeded = diffKm >= MaintenanceLimit || new Date().getFullYear() - getStringToDate(maintenanceDate).getFullYear() >= 2;
  if (maintenanceType === 'Revisione') {
    const dateLastRevision = getStringToDate(maintenanceDate);
    const today = new Date();
    const pastMonths = (today.getFullYear() - dateLastRevision.getFullYear()) * 12 + (today.getMonth() - dateLastRevision.getMonth());

    maintenanceNeeded = pastMonths >= 24; // 24 mesi = 2 anni
  }
  return maintenanceNeeded;
}
