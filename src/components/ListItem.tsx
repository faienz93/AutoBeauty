import { memo, useState } from 'react';
import { IonThumbnail, IonItem, IonLabel, IonIcon, IonText, IonButton, IonBadge } from '@ionic/react';
import { Maintenance } from '../models/MaintenanceType';
import { calendarOutline, pencil, trashOutline } from 'ionicons/icons';
import { AlertConfirmation } from '../components/AlertConfirmation';

import { useHistory } from 'react-router-dom';
import { useMaintenanceIcon } from '../hooks/useMaitenanceIcon';
import { useMaintenanceDb } from '../hooks/useDbContext';

interface ListItemProps {
    maintenance: Maintenance;
    onDelete: () => void;
}

export const ListItem = memo(({ maintenance, onDelete }: ListItemProps) => {

    console.log("ListItem render", maintenance);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const db = useMaintenanceDb();

    const history = useHistory();

    // // https://stackoverflow.com/a/59464381/4700162
    const handleEdit = (item: any) => {
        history.push({
            pathname: `/newItem/edit/${item._id}`
        })

    };

    const handleDeleteMaintenance = async (maintenanceId: string) => {
        try {
            const doc = await db.get(maintenanceId.toString());
            const response = await db.remove(doc);
            console.log('Maintenance deleted successfully:');
            console.log(response);
            onDelete()
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <IonItem key={maintenance._id}>
                <IonThumbnail slot="start">
                    {/* <img src={`/assets/${item.image}`} alt={item.name} /> */}
                    <img src={useMaintenanceIcon(maintenance.tipo)} alt={maintenance.tipo} />
                </IonThumbnail>
                <IonLabel>
                    <h2>{maintenance.tipo}</h2>
                    <IonText>
                        <p>
                            <IonIcon icon={calendarOutline} />
                            {maintenance.data}
                        </p>
                    </IonText>

                    {/* Rating (★ Star icons) */}
                    {/* <p>
                  {Array.from({ length: 5 }, (_, i) => (
                    <IonIcon key={i} icon={i < 3 ? star : starOutline} color="warning" />
                  ))}
                </p> */}

                    {/* KM */}
                    <IonBadge color={'primary'}>KM {maintenance.km}</IonBadge>
                    <p>{maintenance.note}</p>
                </IonLabel>

                {/* Price & Cart Button */}
                <IonText slot="end">
                    <h2>€ {maintenance.costo}</h2>
                </IonText>

                <IonButton fill="clear" slot="end" onClick={() => handleEdit(maintenance)}>
                    <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" id={`delete-alert-${maintenance._id}`} slot="end" onClick={() => setConfirmDelete(true)}>
                    <IonIcon icon={trashOutline} color="danger" />
                </IonButton>
                <AlertConfirmation
                    key={maintenance._id}
                    trigger={`delete-alert-${maintenance._id}`}
                    msg='Sei sicuro di voler eliminare questa manutenzione?'
                    isOpen={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={() => maintenance._id && handleDeleteMaintenance(maintenance._id)}
                />
            </IonItem>
        </>
    )
});