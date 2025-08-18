import { getStringToDate } from './dateUtils';
const MaintenanceLimit = 15000; // limite gomme
const TyreLimit = 10000; // limite tagliando

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
