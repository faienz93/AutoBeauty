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


interface Maintenance {
  date: string;
  km: number;
  type: 'Tagliando' | 'Gomme' | 'Revisione';
  cost: number;
  note: string;
}

function NewItem() {
  console.log('Rendering NewItem component');
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [form, setForm] = useState<Partial<Maintenance>>({});

  const handleAddMaintenance = () => {
    if (form.date && form.km && form.type && form.cost) {
      setMaintenances([...maintenances, form as Maintenance]);
      setForm({});
    }
  };

  const nextTagliando = () => {
    const lastTagliando = maintenances.filter(m => m.type === 'Tagliando').pop();
    if (lastTagliando) {
      return lastTagliando.km + 15000;
    }
    return 15000;
  };

  return (
    <> 
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestione Manutenzione</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {maintenances.map((m, index) => (
            <IonItem key={index}>
              <IonLabel>{`${m.date} - ${m.type} - ${m.km} km - €${m.cost}`}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonItem>
          <IonLabel position="floating">Data</IonLabel>
          <IonInput type="date" onIonChange={e => setForm({ ...form, date: e.detail.value! })}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Km</IonLabel>
          <IonInput type="number" onIonChange={e => setForm({ ...form, km: parseInt(e.detail.value!, 10) })}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Tipo</IonLabel>
          <IonSelect onIonChange={e => setForm({ ...form, type: e.detail.value })}>
            <IonSelectOption value="Tagliando">Tagliando</IonSelectOption>
            <IonSelectOption value="Gomme">Gomme</IonSelectOption>
            <IonSelectOption value="Revisione">Revisione</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Costo (€)</IonLabel>
          <IonInput type="number" onIonChange={e => setForm({ ...form, cost: parseFloat(e.detail.value!) })}></IonInput>
        </IonItem>

        <IonButton expand="full" onClick={handleAddMaintenance}>Aggiungi Manutenzione</IonButton>

        <IonItem>
          <IonLabel>Prossimo Tagliando: {nextTagliando()} km</IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
    
    </>
  );
};

export default NewItem;