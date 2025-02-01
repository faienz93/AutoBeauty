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
  IonTextarea,
  IonNote,
  IonSelectOption
} from '@ionic/react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
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
    
    console.log(formData)

    try {
      const newMaintenance: Maintenance = {
        // id: new Date(),
        data: formData.data,
        km: formData.km,
        tipo: formData.tipo,
        costo: formData.costo,
        note: formData.note
      };
      

      maintenance.push(newMaintenance);
      await addDoc(collection(db, 'maintenances'), newMaintenance);

      setFormData({
        data: '',
        km: 0,
        tipo: 'Tagliando',
        costo: '',
        note: ''
      });

      alert("Manutenzione aggiunta con successo!");

    }catch (error) {
      alert("ERRORE, guarda la console per ulteriori dettagli")
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
        <IonContent color="light">
        <IonList inset={true}>
          <IonItem lines="inset" slot="header">
            <IonInput 
              labelPlacement='floating'
              label="Data"
              type="date"
              name="date"
              value={formData.data}
              onIonChange={e => handleInputChange(e)}
            />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement='floating'
              label='KM'
              type="number"
              name="km"
              value={formData.km}
              onIonChange={e => handleInputChange(e)}
              min={0}
            />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement='floating'
              label='Costo (€)'
              type="number"
              name="costo"
              value={formData.costo}
              onIonChange={e => handleInputChange(e)}
              min={0}
            />
          </IonItem>
          <IonItem lines="inset" slot="header">
            
            <IonSelect 
              labelPlacement='floating'
              label='Tipo'
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
          
        </IonList>

        
        
        <IonList inset={true}>
          <IonItem>
            <IonTextarea label="Comments" label-placement="floating" rows={5}></IonTextarea>
          </IonItem>
          
        
        </IonList>

        <IonNote color="medium" class="ion-margin-horizontal">
          Aggiungi eventuali note o informazioni aggiuntive.
        </IonNote>

        

          
          
          
        <IonButton expand="full" onClick={handleSubmit}>
            Aggiungi Manutenzione
          </IonButton>
        
        </IonContent>

        
    </>
  );
};

export default NewItemPage;