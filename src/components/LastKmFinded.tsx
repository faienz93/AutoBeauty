import { useEffect } from 'react';
import { useState } from 'react';
import { Maintenance } from '../models/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { speedometerOutline } from 'ionicons/icons';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../services/utils';
import { Card } from '../ui/Card';
import { useKilometersDb, useMaintenanceDb } from '../hooks/useDbContext';
import { useIonViewWillEnter } from '@ionic/react';

interface LastKmFindedProps {
    onKmUpdate?: (km: Kilometers) => void;
}

export const LastKmFinded = ({ onKmUpdate }: LastKmFindedProps) => {

    const history = useHistory();
    const dbMaitenenance = useMaintenanceDb();
    const dbKm = useKilometersDb();
    const [currentKm, setCurrentKm] = useState<Kilometers>({
        data: getDateString(),
        km: 0
    });

    

    // https://stackoverflow.com/a/59464381/4700162
    const handleEdit = (lastKm: Kilometers) => {
        console.log("--------------------------------------------------------");
        console.log(lastKm)
        history.push({
            pathname: `/newkm/edit/${lastKm._id}`,
            // search: '?update=true',  // query string
            state: {  // location state
                item: lastKm,
            },
        })

    };

    const getMax = (km: Kilometers, maintenance: Maintenance) => {
        if(km.km > maintenance.km)
            return km;
        return maintenance;
    };


    const getLatestMaintenances = async () => {

        const searchMaintentenanceByKm = await dbMaitenenance.find<Maintenance>({
            selector: {
                km: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
                // _id: { $gt: null }
            },
            sort: [{ km: 'desc' }], // ordina per km decrescente
            limit: 1, // prende solo il primo risultato
            //fields: ['km', 'data'], // opzionalmente prendo solo specific campi
            use_index: 'idx-km'
        });

        console.log('searchMaintentenanceByKm', searchMaintentenanceByKm);

        const searchLastKm = await dbKm.find<Kilometers>({
            selector: {
                km: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
                //_id: { $gt: null }
            },
            sort: [{ km: 'desc' }], // ordina per km decrescente
            limit: 1, // prende solo il primo risultato
            //fields: ['km', 'data'],
            use_index: 'idx-km',
        });

        console.log('searchLastKm', searchLastKm);

        // 1. Estraggo km e data con default a 0 / stringa odierna
        const lastMaintenance = searchMaintentenanceByKm.docs[0] || {};
        const lastKm = searchLastKm.docs[0] || {};

        const mnt = getMax(lastKm, lastMaintenance);
        // 4. Imposto lo stato con il valore e la data massima
        setCurrentKm({
            _id: mnt._id || '',
            _rev: mnt._rev || '',
            km: mnt.km || 0,
            data: getDateString(parseStringToDate(mnt.data)),
        });
    };

    useIonViewWillEnter(() => {
        getLatestMaintenances();
    });

    useEffect(() => {
        onKmUpdate?.(currentKm);
    }, [currentKm, onKmUpdate]);

    return (<>
        <Card
            key={currentKm._id}
            title="Ultimo Kilometro rilevato"
            subtitle={`${currentKm.data}`}
            mainNote={`${currentKm.km}`}
            shadowColor="#3355ff"
            iconContent={{
                type: 'icon',
                source: speedometerOutline
            }}
            onEdit={() => handleEdit(currentKm)}
        />
    </>)
}