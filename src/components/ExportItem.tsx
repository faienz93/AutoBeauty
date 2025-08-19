import { useState } from 'react';
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonToast } from '@ionic/react';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance } from '../types/MaintenanceType';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { downloadOutline } from 'ionicons/icons';
import { getMaintenanceKey } from '../utils/utils';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { convertBlobToBase64, downloadFile } from '../utils/csvUtils';
import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';

const ExportItem = () => {
  const [toast, setToast] = useState<{ message: string; color: 'success' | 'danger' | 'warning' } | null>(null);
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
          const permissionRequest = await Filesystem.requestPermissions();
          if (permissionRequest.publicStorage !== 'granted') {
            console.error("Permesso di salvataggio non concesso dall'utente.");
            setToast({ message: 'Permesso negato. Riprova.', color: 'warning' });
            return;
          }
        }

        const deviceInfo = await Device.getInfo();
        const androidVersion = parseInt(deviceInfo.osVersion || '0', 10);

        let targetDirectory: Directory = Directory.Documents;
        if (deviceInfo.platform === 'android') {
          if (androidVersion <= 9) {
            targetDirectory = Directory.ExternalStorage;
          } else {
            targetDirectory = Directory.Documents;
          }
        }

        try {
          const result = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: targetDirectory,
          });

          // Apriamo Share per dare all'utente possibilità di salvare/inviare
          await Share.share({
            title: 'Template manutenzioni',
            text: 'Template pronto! Suggerimento: salva nella cartella "Download".',
            url: result.uri,
            dialogTitle: 'Condividi il file con…',
          });

          setToast({ message: `File salvato in: ${result.uri}`, color: 'success' });
        } catch (error) {
          console.error('Errore durante il salvataggio del file:', error);
          setToast({ message: 'Permesso negato. Riprova.', color: 'warning' });
        }
      } else {
        downloadFile(filename, csvDataBlob).then(() => {
          setToast({ message: `File salvato correttamente`, color: 'success' });
        });
      }
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
