## Firebase

Prima crea un progetto Firebase:

Vai su https://console.firebase.google.com/
Clicca "Create Project" o "Add Project"
Dai un nome al tuo progetto
Disabilita Google Analytics se non ti serve
Clicca "Create Project"

Installa Firebase nel tuo progetto:

`npm install firebase`

Crea un file src/firebase.ts per la configurazione:

```
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Copia qui le tue credenziali dalla Firebase Console
  // Project Settings -> General -> Your apps -> Web app (</>)
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

- Modifica il tuo componente NewItemPage:

```
import { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Maintenance, MaintenanceType } from '../types';
import { useHistory } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonLoading, IonToast
} from '@ionic/react';

interface MaintenanceForm {
  data: string;
  km: number | '';
  tipo: MaintenanceType | '';
  costo: string;
  note: string;
}

function NewItemPage() {
  const history = useHistory();
  const [formData, setFormData] = useState<MaintenanceForm>({
    data: '',
    km: '',
    tipo: '',
    costo: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'km' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async () => {
    // Validazione
    if (!formData.data || !formData.km || !formData.tipo || !formData.costo) {
      setToastMessage('Compila tutti i campi obbligatori');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const newMaintenance: Maintenance = {
        data: formData.data,
        km: Number(formData.km),
        tipo: formData.tipo as MaintenanceType,
        costo: formData.costo,
        note: formData.note
      };

      // Aggiungi a Firebase
      await addDoc(collection(db, 'maintenances'), newMaintenance);

      // Pulisci il form
      setFormData({
        data: '',
        km: '',
        tipo: '',
        costo: '',
        note: ''
      });

      setToastMessage('Manutenzione aggiunta con successo!');
      setShowToast(true);
      history.push('/');
    } catch (error) {
      console.error('Errore:', error);
      setToastMessage('Errore nel salvataggio. Riprova.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nuova Manutenzione</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Data</IonLabel>
            <IonInput
              type="date"
              name="data"
              value={formData.data}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Km</IonLabel>
            <IonInput
              type="number"
              name="km"
              value={formData.km}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Tipo</IonLabel>
            <IonSelect
              name="tipo"
              value={formData.tipo}
              onIonChange={handleInputChange}
            >
              <IonSelectOption value="Tagliando">Tagliando</IonSelectOption>
              <IonSelectOption value="Revisione">Revisione</IonSelectOption>
              <IonSelectOption value="Gomme">Gomme</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Costo</IonLabel>
            <IonInput
              type="text"
              name="costo"
              value={formData.costo}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Note</IonLabel>
            <IonInput
              type="text"
              name="note"
              value={formData.note}
              onIonChange={handleInputChange}
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          onClick={handleSubmit}
          className="ion-margin-top"
        >
          Salva Manutenzione
        </IonButton>

        <IonLoading
          isOpen={loading}
          message="Salvataggio in corso..."
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
}

export default NewItemPage;
```

Per leggere i dati in un altro componente:

```
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// All'interno del tuo componente:
const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

const fetchMaintenances = async () => {
  const querySnapshot = await getDocs(collection(db, 'maintenances'));
  const data = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Maintenance[];
  setMaintenances(data);
};

useEffect(() => {
  fetchMaintenances();
}, []);
```

Questo setup ti dà:

Persistenza dei dati in cloud
Sincronizzazione in tempo reale (se la implementi)
UI reattiva con loading states e feedback
Gestione degli errori
Validazione dei dati

Vuoi che ti mostri anche come:

Implementare la lettura in tempo reale dei dati?
Aggiungere l'autenticazione?
Aggiungere regole di sicurezza?
