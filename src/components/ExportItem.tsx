import { useState } from 'react';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonToast } from '@ionic/react';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance } from '../models/MaintenanceType';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { downloadOutline } from 'ionicons/icons';
import { getMaintenanceKey } from '../utils/pouchDBUtils';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { convertBlobToBase64, downloadFile } from '../utils/csvUtils';

const ExportItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [noData, setNoData] = useState(false);

  const db = useMaintenanceDb();
  const csvService = new CsvService();

  const handleExport = async () => {
    try {
      const result = await db.allDocs({ include_docs: true });
      const data = result.rows
        .filter((value) => {
          // filtra solo i documenti che hanno une specifica chiave
          const key = getMaintenanceKey();
          return value.doc?._id.startsWith(key);
        })
        .map((row: any) => ({
          id: row.doc._id,
          ...row.doc,
        }));

      if (data.length === 0) {
        setNoData(true);
        return;
      }

      const csvDataBlob = await csvService.exportCsvWithBlob(data as Maintenance[], ['data', 'km', 'tipo', 'costo', 'note']);

      const base64Data = (await convertBlobToBase64(csvDataBlob)) as string;

      const filename = `maintenance_${new Date().toISOString().slice(0, 10)}.csv`;
      if (Capacitor.isNativePlatform()) {
        const permissionResult = await Filesystem.checkPermissions();

        if (permissionResult.publicStorage !== 'granted') {
          // Richiedi i permessi se non sono stati concessi
          await Filesystem.requestPermissions();
        }

        try {
          await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.Data,
          });

          setIsSuccess((prevValue) => !prevValue);
        } catch (error) {
          console.error('Errore durante il salvataggio del file:', error);
          setIsSuccess(false);
        }
      } else {
        downloadFile(filename, csvDataBlob).then(() => {
          setIsSuccess((prevValue) => !prevValue);
        });
      }
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      setIsSuccess(false);
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
      <IonToast
        isOpen={isSuccess}
        onDidDismiss={() => setIsSuccess((prevValue) => !prevValue)}
        message={isSuccess ? 'Esportazione avvenuto con successo' : "Errore durante l'esportazione"}
        duration={3000}
        color={isSuccess ? 'success' : 'danger'}
      />
    </>
  );
};

export default ExportItem;
