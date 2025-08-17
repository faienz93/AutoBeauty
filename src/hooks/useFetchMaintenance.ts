import { useMaintenanceDb } from './useDbContext';
import { Maintenance } from '../types/MaintenanceType';
import { parseStringToDate } from '../utils/dateUtils';
import { getMaintenanceKey } from '../utils/pouchDBUtils';

export const useFetchMaintenances = (): (() => Promise<Maintenance[]>) => {
  const dbMaitenenance = useMaintenanceDb();

  const fetchMaintenances = async (): Promise<Maintenance[]> => {
    const res = await dbMaitenenance.allDocs({ include_docs: true });
    const maintenance = res.rows
      .filter((value) => {
        // filtra solo i documenti che hanno une specifica chiave
        const key = getMaintenanceKey();
        return value.doc?._id.startsWith(key);
      })
      .map((row: any) => ({
        id: row.doc._id,
        ...row.doc,
      }))
      .sort((a: Maintenance, b: Maintenance) => {
        // Ordina per data decrescente
        return new Date(parseStringToDate(b.data)).getTime() - new Date(parseStringToDate(a.data)).getTime();

        // Oppure per km decrescente
        // return b.km - a.km;
      }) as Maintenance[];

    return maintenance;
  };

  return fetchMaintenances;
};
