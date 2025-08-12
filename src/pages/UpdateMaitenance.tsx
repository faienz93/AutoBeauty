import { useParams } from 'react-router-dom';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { useState, useEffect } from 'react';
import { Maintenance } from '../models/MaintenanceType';
import { IonToast, IonPage, useIonViewWillLeave } from '@ionic/react';
import { Header } from '../components/Header';
import { FormMaintenance } from '../components/FormMaintenance';

const UpdateMaintenance = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const db = useMaintenanceDb();
  const [item, setItem] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.get(id)
      .then((fetched) => {
        setItem(fetched);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Errore nel recupero item', error);
        setLoading(false);
      });
  }, [id, db]);

  useIonViewWillLeave(() => {
    setIsSuccess(false);
  });

  if (loading) return <div>Caricamento…</div>;
  if (!item) return <div>Item non trovato</div>;

  const handleUpdateMaintenance = async (maintenance: Maintenance) => {
    db.put(maintenance)
      .then((response) => {
        console.log('Maintenance added successfully:', response);
      })
      .catch((error) => {
        console.error('Error adding maintenance:', error);
      });
  };

  const handleSubmit = async (formData: Maintenance) => {
    try {
      handleUpdateMaintenance(formData).then(() => {
        setIsSuccess((prevValue) => !prevValue);
      });
    } catch (error) {
      setIsSuccess(false);
      console.error('Errore nel salvataggio:', error);
    } finally {
      setToastOpen(true);
    }
  };

  // return <NewMaintenance editingItem={item} key={id} />;
  return (
    <IonPage>
      <Header title="Modifica Manutenzione" />

      <FormMaintenance editData={item} onSubmit={handleSubmit}>
        <IonToast
          isOpen={toastOpen && isSuccess}
          onDidDismiss={() => setToastOpen(false)}
          color="success"
          message="Manutenzione modificata con successo!"
          duration={1000}
        />

        <IonToast
          isOpen={toastOpen && !isSuccess}
          onDidDismiss={() => setToastOpen(false)}
          color="danger"
          message="Errore durante la modifica della manutenzione"
          duration={1000}
        />
      </FormMaintenance>
    </IonPage>
  );
};

export default UpdateMaintenance;
