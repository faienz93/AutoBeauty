import React, { useContext, useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonToast } from '@ionic/react';
import { AlertConfirmation } from './AlertConfirmation';
import { KilometersDbCtx, MaintenanceDbCtx } from '../App';



const DeleteAllItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const maintenanceDb = useContext(MaintenanceDbCtx);
  const kmDb = useContext(KilometersDbCtx);

  const handleDelete = async () => {
    const deletedMaintenanceDb = maintenanceDb.deleteDatabase();
    const deletedKmDb = kmDb.deleteDatabase();
    
    console.log(deletedMaintenanceDb)
    console.log(deletedKmDb)
    setIsSuccess(true);
  };

  return (
    <>

      <IonItemDivider color="light" className='buttonAddList'>
        <h1>Cancella tutto</h1>
      </IonItemDivider>

      <IonButton color="danger" expand="full" id="delete-allitem" className="buttonAddList" onClick={() => setConfirmDelete(true)}>
        Cancella tutto
      </IonButton>


      <AlertConfirmation
        msg="Sei sicuro di voler cancellare tutto? Questa azione non può essere annullata."
        trigger="delete-allitem"
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleDelete()}
      />

      {isSuccess ? (
        <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Cancellazione avvenuta con successo" duration={1000}></IonToast>
      ) : (
        <IonToast trigger="open-toast" color="danger" message="Errore durante la cancellazione" duration={1000}></IonToast>
      )}

    </>
  );
};

export default DeleteAllItem;
