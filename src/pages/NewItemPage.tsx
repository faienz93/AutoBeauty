import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import maintenanceData from '../data/data.json';
import { Maintenance, MaintenanceType } from '../types/Maintenance';
const maintenance: Maintenance[] = maintenanceData as Maintenance[];

import { useHistory } from 'react-router-dom';

function NewItemPage() {
  console.log('Rendering NewItem component');
  const history = useHistory();

  const [formData, setFormData] = useState({
    data: '',
    km: 0,
    tipo: 'Tagliando' as MaintenanceType,
    costo: '',
    note: ''
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => { 
    alert("submit")
    console.log(formData)

    try {

      const newMaintenance: Maintenance = {
        // id: Date.now(),
        data: formData.data,
        km: formData.km,
        tipo: formData.tipo,
        costo: formData.costo,
        note: formData.note
      };
      

      maintenance.push(newMaintenance);

    }catch (error) {
      console.error('Errore nel salvataggio:', error);
    }

    history.push('/home');
  }

  return (
    <>    
        <IonHeader>
          <IonToolbar>
            <IonTitle>Maintenance</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen class="component-content">
        <IonList inset={true}>
          <IonItem lines="inset" slot="header">
            <IonLabel position="floating">Data</IonLabel>
            <IonInput 
              type="date"
              name="date"
              value={formData.data}
              onIonChange={e => handleInputChange(e)}
            />
          </IonItem>
          <IonItem lines="inset" slot="header">
            <IonLabel position="floating">Km</IonLabel>
            <IonInput 
              type="number"
              name="km"
              value={formData.km}
              onIonChange={e => handleInputChange(e)}
              min={0}
            />
          </IonItem>
          <IonItem lines="inset" slot="header">
            <IonLabel position="floating">Tipo</IonLabel>
            <IonSelect 
              aria-label="Maintenance"
              interface="action-sheet"
              placeholder="Select Maintenance"
              name="type"
              value={formData.tipo}
              onIonChange={e => handleInputChange(e)}
            >
              <IonSelectOption value="Tagliando">Tagliando</IonSelectOption>
              <IonSelectOption value="Gomme">Gomme</IonSelectOption>
              <IonSelectOption value="Revisione">Revisione</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Costo (€)</IonLabel>
            <IonInput 
              type="number"
              name="cost"
              value={formData.costo}
              onIonChange={e => handleInputChange(e)}
              min={0}
            />
          </IonItem>
          <IonButton expand="full" onClick={handleSubmit}>
            Aggiungi Manutenzione
          </IonButton>
        </IonList>
        </IonContent>
    </>
  );
};

export default NewItemPage;