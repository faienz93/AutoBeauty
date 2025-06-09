import { ReactNode, useEffect } from 'react';
import { useState } from 'react';
import { Maintenance } from '../models/MaintenanceType';
import { useHistory } from 'react-router-dom';
import { speedometerOutline } from 'ionicons/icons';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../services/utils';
import { Card } from '../ui/Card';
import { useKilometersDb, useMaintenanceDb } from '../hooks/useDbContext';
import { IonText, useIonViewWillEnter } from '@ionic/react';

interface LastKmFindedProps {
    // onKmUpdate?: (km: Kilometers) => void;
    lastManualKm: Kilometers;
    maintenanceWithHigherKm: Maintenance;

}

export const LastKmFinded = ({ lastManualKm, maintenanceWithHigherKm }: LastKmFindedProps) => {

    const history = useHistory(); 
    
    let content: ReactNode = '';
    if(maintenanceWithHigherKm && lastManualKm.km < maintenanceWithHigherKm.km) {
        let msg = `Attenzione hai impostato un Kilometraggio manuale (${lastManualKm.km} km) che è inferiore al massimo dei km segnati per una manutenzione (${maintenanceWithHigherKm.km} km). Il valore più alto verrà usato nei calcoli.`
        content = (
            <IonText color="danger" style={{ fontSize: '0.9em', lineHeight: '1.3' }}>
                {msg}
            </IonText>
        );
    }
    
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

    return (<>
        <Card
            key={lastManualKm._id}
            title="Ultimo Kilometro rilevato"
            subtitle={`${lastManualKm.data}`}
            mainNote={`${lastManualKm.km}`}
            comment={content}
            shadowColor="#3355ff"
            iconContent={{
                type: 'icon',
                source: speedometerOutline
            }}
            onEdit={() => handleEdit(lastManualKm)}
        />
    </>)
}