import { useState } from 'react';
import { IonToast, useIonViewWillLeave, IonPage } from '@ionic/react';
import './ItemPage.css';
import { Maintenance } from '../types/MaintenanceType';
import { Header } from '../components/Header';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { FormMaintenance } from '../components/FormMaintenance';

const NewMaintenance = () => {
  const db = useMaintenanceDb();
  const [toastOpen, setToastOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddMaintenance = async (maintenance: Maintenance) => {
    try {
      await db.put(maintenance);
    } catch (error) {
      console.error('Error adding maintenance:', error);
    }
  };

  const handleSubmit = async (formData: Maintenance) => {
    try {
      handleAddMaintenance(formData).then(() => {
        setIsSuccess((prevValue) => !prevValue);
      });
    } catch (error) {
      setIsSuccess(false);
      console.error('Errore nel salvataggio:', error);
    } finally {
      setToastOpen(true);
    }
  };

  useIonViewWillLeave(() => {
    setIsSuccess(false);
  });

  return (
    <IonPage>
      <Header title="Aggiungi Manutenzione" />

      <FormMaintenance onSubmit={handleSubmit}>
        <IonToast
          isOpen={toastOpen && isSuccess}
          onDidDismiss={() => setToastOpen(false)}
          color="success"
          message="Manutenzione aggiunta con successo!"
          duration={1000}
        />

        <IonToast
          isOpen={toastOpen && !isSuccess}
          onDidDismiss={() => setToastOpen(false)}
          color="danger"
          message="Errore durante l'aggiunta della manutenzione"
          duration={1000}
        />
      </FormMaintenance>
    </IonPage>
  );
};

export default NewMaintenance;
