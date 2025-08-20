import { Kilometers } from '../types/KilometersType';
import { getDateToString, getStringToDate } from '../utils/dateUtils';
import { useKilometersDb } from './useDbContext';

export const useFetchManualKm = (): (() => Promise<Kilometers>) => {
  const dbKm = useKilometersDb();

  const fetchManualKm = async (): Promise<Kilometers> => {
    // REF: https://pouchdb.com/api.html#create_document

    try {
      const searchLastManualKm = await dbKm.get<Kilometers>('manual-km');

      return {
        _id: searchLastManualKm._id || 'manual-km',
        _rev: searchLastManualKm._rev || '',
        km: searchLastManualKm.km || 0,
        data: getDateToString(getStringToDate(searchLastManualKm.data)),
      };
    } catch (err: any) {
      console.error('No lastKm found, using default');
      console.error(err);

      return {
        _id: 'manual-km',
        km: 0,
        data: getDateToString(new Date()),
      };
    }
  };

  return fetchManualKm;
};
