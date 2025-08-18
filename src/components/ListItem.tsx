import { memo, useState } from 'react';
import { IonThumbnail, IonItem, IonLabel, IonIcon, IonText, IonButton, IonBadge } from '@ionic/react';
import { Maintenance } from '../types/MaintenanceType';
import { pencil, trashOutline } from 'ionicons/icons';
import { AlertConfirmation } from '../components/AlertConfirmation';

import { useHistory } from 'react-router-dom';
import { useMaintenanceCardIcon } from '../hooks/useMaitenanceCardIcon';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { emojisIcon } from '../types/Icon';
import './ListItem.css';
interface ListItemProps {
  maintenance: Maintenance;
  onDelete: () => void;
}

export const ListItem = memo(({ maintenance, onDelete }: ListItemProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const db = useMaintenanceDb();

  const history = useHistory();

  const km = typeof maintenance.km === 'number' && maintenance.km > 1000 ? maintenance.km.toLocaleString('it-IT') : maintenance.km;

  // // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: Maintenance) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
    });
  };

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    try {
      const doc = await db.get(maintenanceId.toString());
      await db.remove(doc);

      onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <IonItem key={maintenance._id} className="maintenance-list">
        <IonThumbnail slot="start">
          <img src={useMaintenanceCardIcon(maintenance.tipo)} alt={maintenance.tipo} />
        </IonThumbnail>
        <IonLabel>
          <h2>{maintenance.tipo}</h2>
          <IonText>
            <p>
              {emojisIcon.calendar}
              {maintenance.data}
            </p>
          </IonText>

          {/* KM */}
          <IonBadge color={'primary'}>KM {km}</IonBadge>
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
          msg="Sei sicuro di voler eliminare questa manutenzione?"
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => maintenance._id && handleDeleteMaintenance(maintenance._id)}
        />
      </IonItem>
    </>
  );
});
