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
    // onKmUpdate?: (km: Kilometers) => void;
    currentKm: Kilometers;

}

export const LastKmFinded = ({ currentKm }: LastKmFindedProps) => {

    const history = useHistory();   
    
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