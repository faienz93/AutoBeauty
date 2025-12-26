import { useCallback } from 'react';
import { useMaintenanceDb } from './useDbContext';
import { Maintenance } from '../types/MaintenanceType';
import { getStringToDate } from '../utils/dateUtils';
import { getMaintenanceKey } from '../utils/business';

export const useFetchMaintenances = (): (() => Promise<Maintenance[]>) => {
  const dbMaitenenance = useMaintenanceDb();

  const fetchMaintenances = useCallback(async (): Promise<Maintenance[]> => {
    const res = await dbMaitenenance.allDocs({ include_docs: true });
    const maintenance: Maintenance[] = res.rows
      .filter((value) => {
        // filtra solo i documenti che hanno une specifica chiave
        const key = getMaintenanceKey();
        return value.doc?._id.startsWith(key);
      })
      .map((row) => {
        const doc = row.doc as Maintenance;
        return {
          ...doc,
          id: doc._id,
        };
      })
      .sort((a: Maintenance, b: Maintenance) => {
        // Ordina per data decrescente
        return new Date(getStringToDate(b.data)).getTime() - new Date(getStringToDate(a.data)).getTime();
      });

    return maintenance;
  }, [dbMaitenenance]);

  return fetchMaintenances;
};
