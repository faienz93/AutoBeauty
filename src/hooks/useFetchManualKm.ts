import { Kilometers } from '../types/KilometersType';
import { getDateToString, getStringToDate } from '../utils/dateUtils';
import { useKilometersDb } from './useDbContext';

export const useFetchManualKm = (): (() => Promise<Kilometers>) => {
  const dbKm = useKilometersDb();

  const fetchManualKm = async (): Promise<Kilometers> => {
    // REF: https://pouchdb.com/api.html#create_document
    let lastKm: Kilometers = {
      _id: 'manual-km',
      // _rev: '',
      data: getDateToString(),
      km: 0,
    };

    const searchLastManualKm = await dbKm.get<Kilometers>('manual-km');
    if (searchLastManualKm) {
      lastKm = {
        _id: searchLastManualKm._id || '',
        _rev: searchLastManualKm._rev || '',
        km: searchLastManualKm.km || 0,
        data: getDateToString(getStringToDate(searchLastManualKm.data)),
      };
    }

    return lastKm;
  };

  return fetchManualKm;
};
