import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonButton, IonIcon } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from '../components/Header';
import { KilometersDbCtx, MaintenanceDbCtx } from '../App';
import { CardMaintenance } from '../components/CardMaintenance';
import { useHistory } from 'react-router-dom';
import { pencil } from 'ionicons/icons';
import { Kilometers } from '../models/KilometersType';
import { getDateString, getMaintenanceKey } from '../services/utils';

interface LastKmFindedProps {
    onKmUpdate?: (km: Kilometers) => void;
}

export const LastKmFinded = ({onKmUpdate}: LastKmFindedProps) => {

    const dbMaitenenance = useContext(MaintenanceDbCtx);
    const dbKm = useContext(KilometersDbCtx);
    const [currentKm, setCurrentKm] = useState<Kilometers>({
        data: getDateString(),
        km: 0
    });

    const history = useHistory();

    // https://stackoverflow.com/a/59464381/4700162
    const handleEdit = (lastKm: Kilometers) => {
        history.push({
            pathname: `/newkm/edit/${lastKm._id}`,
            // search: '?update=true',  // query string
            state: {  // location state
                item: lastKm,
            },
        })

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
        const kmMaint = lastMaintenance.km ?? 0;
        const kmLast = lastKm.km ?? 0;
        const dataMaint = lastMaintenance.data ?? getDateString();
        const dataLast = lastKm.data ?? getDateString();
        // 2. Calcolo il chilometraggio massimo
        const maxKm = Math.max(kmMaint, kmLast);
        // 3. Determino la data corrispondente al massimo
        const maxData = (kmMaint >= kmLast) ? dataMaint : dataLast;
        // 4. Imposto lo stato con il valore e la data massima
        setCurrentKm({
            km: maxKm,
            data: maxData
        });
    };

    useEffect(() => { 
        getLatestMaintenances();
    }, []);

    useEffect(() => {
        onKmUpdate?.(currentKm);
    }, [currentKm, onKmUpdate]);

    return (<>
        <IonCard color='tertiary'>
            <IonCardHeader style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                // justifyContent: 'space-between' 
            }}>
                <IonCardTitle>Ultimo Kilometro rilevato</IonCardTitle>
                <IonCardSubtitle>{currentKm.data}: <strong>{currentKm.km}</strong></IonCardSubtitle>
                <IonButton style={{ color: 'white' }} fill="clear" onClick={() => handleEdit(currentKm)}>
                    <IonIcon icon={pencil} /> Modifica
                </IonButton>
            </IonCardHeader>
        </IonCard>
    </>)
}