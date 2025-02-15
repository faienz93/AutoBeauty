import React, { useState } from 'react';
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonToast,
  IonInput,
  IonSelect,
  IonTextarea,
  IonNote,
  IonSelectOption,
} from '@ionic/react';
import './NewItemPage.css';
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './NewItemPage.css';
import { Maintenance, MaintenanceType } from '../types/Maintenance';
const maintenance: Maintenance[] = [];

import { useHistory } from 'react-router-dom';
import DataPickerPopup from '../components/DataPickerPopup';
import { getEnv } from '../services/env';
import { Header } from './Header';

const envVar = getEnv()

function NewItemPage() {
  console.log('Rendering NewItem component');
  const [isSuccess, setIsSuccess] = useState(false);
  const history = useHistory();

  const [formData, setFormData] = useState({
    data: new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    km: 0,
    tipo: 'Tagliando' as MaintenanceType,
    costo: '',
    note: '',
  });

  const handleInputChange = (inputIdentifier: any, newValue: any) => {
    if (inputIdentifier === 'data') {
      const selectedDate = new Date(newValue).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      newValue = selectedDate;
    }

    setFormData((prevState) => ({
      ...prevState,
      [inputIdentifier]: newValue,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);

    try {
      const customId = JSON.stringify(new Date())
      const newMaintenance: Maintenance = {
        id: customId,
        data: formData.data,
        km: formData.km,
        tipo: formData.tipo,
        costo: formData.costo,
        note: formData.note,
      };

      maintenance.push(newMaintenance);
      await setDoc(doc(db, envVar?.collection, customId), newMaintenance);
      

      setFormData({
        data: '',
        km: 0,
        tipo: 'Tagliando',
        costo: '',
        note: '',
      });
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      console.error('Errore nel salvataggio:', error);
    }
  };

  return (
    <>
      <Header title='Maintenance' />
      <IonContent color="light">
        <IonList inset={true}>
          <IonItem lines="inset" slot="header">
            <DataPickerPopup title="Scegli data" currentDate={formData.data} onChange={handleInputChange} />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              label="KM"
              type="number"
              name="km"
              value={formData.km}
              onIonChange={(e) => handleInputChange('km', e.detail.value)}
              min={0}
            />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              label="Costo (€)"
              type="number"
              name="costo"
              value={formData.costo}
              onIonChange={(e) => handleInputChange('costo', e.detail.value)}
              min={0}
            />
          </IonItem>
          <IonItem lines="inset" slot="header">
            <IonSelect
              labelPlacement="floating"
              label="Tipo"
              aria-label="Maintenance"
              interface="action-sheet"
              placeholder="Select Maintenance"
              name="type"
              value={formData.tipo}
              onIonChange={(e) => handleInputChange('tipo', e.detail.value)}>
              <IonSelectOption value="Tagliando">Tagliando</IonSelectOption>
              <IonSelectOption value="Gomme">Gomme</IonSelectOption>
              <IonSelectOption value="Revisione">Revisione</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonNote color="medium" class="ion-margin-horizontal">
          Aggiungi eventuali note.
        </IonNote>
        <IonList inset={true}>
          <IonItem>
            <IonTextarea label="Comments" label-placement="floating" rows={5} onIonChange={(e) => handleInputChange('note', e.detail.value)}></IonTextarea>
          </IonItem>
        </IonList>
        <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleSubmit}>
          Aggiungi Manutenzione
        </IonButton>

        {isSuccess ? (
          <IonToast
            trigger="open-toast"
            color="success"
            message="Manutenzione aggiunta con successo!"
            duration={5000}
            onDidDismiss={() => {
              history.push('/home');
            }}></IonToast>
        ) : (
          <IonToast trigger="open-toast" color="danger" message="Errore durante l'aggiunta della manutenzione" duration={5000}></IonToast>
        )}
      </IonContent>
    </>
  );
}

export default NewItemPage;
