import React, { useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonToast } from '@ionic/react';



const DeleteAllItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDelete = async () => {
    alert("Deleting data...");
    setIsSuccess(true);

  };

  return (
    <>

      <IonItemDivider color="light" className='buttonAddList'>
        <h1>Cancella tutto</h1>
      </IonItemDivider>

      <IonButton color="danger" expand="full" className="buttonAddList" onClick={handleDelete}>
        Cancella tutto
      </IonButton>

      {isSuccess ? (
        <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Cancellazione avvenuta con successo" duration={1000}></IonToast>
      ) : (
        <IonToast trigger="open-toast" color="danger" message="Errore durante la cancellazione" duration={1000}></IonToast>
      )}

    </>
  );
};

export default DeleteAllItem;
