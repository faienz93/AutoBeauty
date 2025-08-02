import { parseStringToDate } from "./dateUtils";
import { LimitGomme, LimitTagliando } from "../constant";

export function isMaintenanceNeeded(maintenanceType: string, diffKm: number, maintenanceDate: string) {
    let todo = false;
    if (maintenanceType === 'Gomme') todo = diffKm >= LimitGomme;
    if (maintenanceType === 'Tagliando') todo = diffKm >= LimitTagliando;
    if (maintenanceType === 'Revisione') {
      const dataUltimaRevisione = parseStringToDate(maintenanceDate);
      const dataAttuale = new Date();
      const mesiPassati = (dataAttuale.getFullYear() - dataUltimaRevisione.getFullYear()) * 12 +
        (dataAttuale.getMonth() - dataUltimaRevisione.getMonth());

      todo = mesiPassati >= 24; // 24 mesi = 2 anni
    }
    return todo;
  }