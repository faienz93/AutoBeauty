import { Kilometers } from "../models/KilometersType";
import { Maintenance, Stats } from "../models/MaintenanceType";
import { parseStringToDate } from "../services/utils";



export const getMaintenanceWithHigherKm = (maintenance: Maintenance[]): Maintenance | null => {

    if (maintenance.length === 0) return null;

    // O(n)
    const maintenaceWithHigherKm = maintenance.reduce((acc, current) => {
        if (!acc || current.km > acc.km) {
            return current;
        }
        return acc;
    }, null as Maintenance | null)

    console.log('Maintenance With Highest Km: ', maintenaceWithHigherKm)

    return maintenaceWithHigherKm
}


export const getGroupByMaintenanceByKm = (maintenance: Maintenance[]): Stats | null => {

    if (maintenance.length === 0) return {};

    const maintenanceGrouped = maintenance.reduce((acc, current) => {
        const existing = acc[current.tipo];

        // Se non esiste una manutenzione per questo tipo O
        // se la manutenzione corrente è più recente, aggiorna
        if (!existing ||
            new Date(parseStringToDate(current.data)).getTime() >
            new Date(parseStringToDate(existing.data)).getTime()) {
            acc[current.tipo] = current;
        }

        return acc;
    }, {} as Stats);
    console.log('Maintenance Grouped: ', maintenanceGrouped)

    return maintenanceGrouped

}


export const getMaxKmBetween = (km: Kilometers, maintenance: Maintenance) => {
    if (km.km > maintenance.km)
      return km;
    return maintenance;
  };