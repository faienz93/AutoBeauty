import { useState } from 'react';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonToast } from '@ionic/react';
import { AlertConfirmation } from './AlertConfirmation';
import { useKilometersDb, useMaintenanceDb } from '../hooks/useDbContext';
import { trashOutline } from 'ionicons/icons';

const DeleteAllItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const maintenanceDb = useMaintenanceDb();
  const kmDb = useKilometersDb();

  const handleDelete = async () => {
    try {
      const deletedMaintenanceDb = maintenanceDb.deleteDatabase();
      const deletedKmDb = kmDb.deleteDatabase();

      console.log(deletedMaintenanceDb);
      console.log(deletedKmDb);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    } finally {
      setToastOpen(true);
    }
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Cancella tutto</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p className="ion-padding-bottom">Cancella tutti i dati dal database.</p>

          <IonButton expand="block" color={'danger'} onClick={() => setConfirmDelete(true)} className="ion-margin-bottom">
            <IonIcon icon={trashOutline} slot="start" />
            Cancella
          </IonButton>
        </IonCardContent>
      </IonCard>

      <AlertConfirmation
        msg="Sei sicuro di voler cancellare tutto? Questa azione non può essere annullata."
        trigger="delete-allitem"
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleDelete()}
      />

      <IonToast
        isOpen={toastOpen && isSuccess}
        onDidDismiss={() => setToastOpen(false)}
        color="success"
        message="Cancellazione avvenuta con successo"
        duration={1000}
      />

      <IonToast
        isOpen={toastOpen && !isSuccess}
        onDidDismiss={() => setToastOpen(false)}
        color="danger"
        message="Errore durante la cancellazione"
        duration={1000}
      />
    </>
  );
};

export default DeleteAllItem;
