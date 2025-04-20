import React, { useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonToast } from '@ionic/react';



const ExportItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = async () => {
    alert("Eporting data...");
    setIsSuccess(true);

  };

  return (
    <>

      <IonItemDivider color="light" className='buttonAddList'>
        <h1>Esporta</h1>
      </IonItemDivider>

      <IonButton color="danger" expand="full" className="buttonAddList" onClick={handleExport}>
        Esporta
      </IonButton>

      {isSuccess ? (
        <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Caricamento avvenuto con successo" duration={1000}></IonToast>
      ) : (
        <IonToast trigger="open-toast" color="danger" message="Errore durante il caricamento" duration={1000}></IonToast>
      )}

    </>
  );
};

export default ExportItem;
