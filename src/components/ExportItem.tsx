import { useState } from 'react';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonToast } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { exportOnShare } from '../utils/csvUtils';

import { useFetchMaintenances } from '../hooks/useFetchMaintenance';

const ExportItem = () => {
  const fetchMaintenancesData = useFetchMaintenances();
  const [toast, setToast] = useState<{ message: string; color: 'success' | 'danger' | 'warning' } | null>(null);
  const [noData, setNoData] = useState(false);

  const handleExport = async () => {
    try {
      const result = await fetchMaintenancesData();
      const filename = `maintenance_${new Date().toISOString().slice(0, 10)}.csv`;

      const exportResult = await exportOnShare(result, filename);
      setToast(exportResult);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      setToast({ message: "Errore durante l'operazione.", color: 'danger' });
    }
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Esporta</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p className="ion-padding-bottom">Esporta tutti i dati in formato csv.</p>
          <IonButton expand="block" onClick={() => handleExport()} className="ion-margin-bottom">
            <IonIcon icon={downloadOutline} slot="start" />
            Esporta
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonAlert
        isOpen={noData}
        header="Attenzione!"
        onDidDismiss={() => setNoData((prevValue) => !prevValue)}
        message="Non ci sono dati da esportare."
        buttons={['Ok!']}></IonAlert>
      <IonToast isOpen={toast !== null} onDidDismiss={() => setToast(null)} message={toast?.message} duration={3000} color={toast?.color} />
    </>
  );
};

export default ExportItem;
