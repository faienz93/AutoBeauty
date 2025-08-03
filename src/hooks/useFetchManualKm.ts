import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../utils/dateUtils';
import { useKilometersDb } from './useDbContext';

export const useFetchManualKm = (): (() => Promise<Kilometers>) => {
    const dbKm = useKilometersDb();

    const fetchManualKm = async (): Promise<Kilometers> => {

        // REF: https://pouchdb.com/api.html#create_document
        let lastKm: Kilometers = {
            _id: 'manual-km',
            // _rev: '',
            data: getDateString(),
            km: 0
        };

        try {
            const searchLastManualKm = await dbKm.get('manual-km');
            if (searchLastManualKm) {
                lastKm = {
                    _id: searchLastManualKm._id || '',
                    _rev: searchLastManualKm._rev || '',
                    km: searchLastManualKm.km || 0,
                    data: getDateString(parseStringToDate(searchLastManualKm.data)),
                };
            }

        } catch (err) {
            console.log(err);
        }
        console.log('searchLastManualKm', lastKm);
        return lastKm

    }

    return fetchManualKm
}