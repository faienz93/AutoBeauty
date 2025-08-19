import React, { useRef, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonToast } from '@ionic/react';
import { addOutline, cloudUpload, informationCircle } from 'ionicons/icons';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance, MaintenanceType } from '../types/MaintenanceType';
import { getDateToString, getStringToDate, parseItalianNumber } from '../utils/dateUtils';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { getUUIDKey } from '../utils/utils';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { convertBlobToBase64, downloadFile } from '../utils/csvUtils';
import { FileTransfer } from '@capacitor/file-transfer';
import { Device } from '@capacitor/device';

const data = [
  {
    data: '6 gen 2022',
    km: 83938,
    tipo: 'Gomme',
    costo: 30,
    note: 'Esempio di nota',
  },
  {
    data: '21 ago 2019',
    km: 62000,
    tipo: 'Tagliando',
    costo: 50,
    note: '',
  },
];

const ImportItem = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const db = useMaintenanceDb();

  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; color: 'success' | 'danger' | 'warning' } | null>(null);
  const [label, setLabel] = useState('Nessun File scelto');
  const csvService = new CsvService();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setLabel(selectedFile.name);
    } else {
      setLabel('Nessun File scelto');
    }
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const importedItemFromCsv = (await csvService.importCsv(file)) as Maintenance[];

      // Parse result
      const convertedItems: Maintenance[] = importedItemFromCsv.map((item) => ({
        _id: getUUIDKey(),
        data: getDateToString(getStringToDate(item.data)),
        km: parseItalianNumber(item.km), // gestisce numeri con virgola italiana
        tipo: item.tipo as MaintenanceType,
        costo: parseItalianNumber(item.costo), // gestisce numeri con virgola italiana
        note: item.note || '',
      }));

      const result = await db.bulkDocs(convertedItems);
      if (result) {
        setToast({ message: 'File salvato con successo!', color: 'success' });
        setFile(null);
        setLabel('Nessun File scelto');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Errore durante l'operazione.", color: 'danger' });
      setFile(null);
      setLabel('Nessun File scelto');
    }
  };

  const handleTemplateDownload = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const csvDataBlob = await csvService.exportCsvWithBlob(data as Maintenance[], ['data', 'km', 'tipo', 'costo', 'note']);
      const filename = `template_manutenzioni.csv`;

      if (Capacitor.isNativePlatform()) {
        const base64Data = (await convertBlobToBase64(csvDataBlob)) as string;

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

        const permissionResult = await Filesystem.checkPermissions();

        if (permissionResult.publicStorage !== 'granted') {
          const permissionRequest = await Filesystem.requestPermissions();
          if (permissionRequest.publicStorage !== 'granted') {
            console.error("Permesso di salvataggio non concesso dall'utente.");
            setToast({ message: 'Permesso negato. Riprova.', color: 'warning' });
            return;
          }
        }

        // Scrittura file
        const result = await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: targetDirectory,
        });

        setToast({ message: `File salvato in: ${result.uri}`, color: 'success' });

        // Progress events
        FileTransfer.addListener('progress', (progress) => {
          console.log(`Downloaded ${progress.bytes} of ${progress.contentLength}`);
        });
      } else {
        // Web browser: download classico
        downloadFile(filename, csvDataBlob).then(() => {
          setToast({ message: `File salvato correttamente`, color: 'success' });
        });
      }
    } catch (error) {
      console.error('Errore durante il download del template:', error);
      setToast({ message: "Errore durante l'operazione.", color: 'danger' });
    }
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Importa</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <p className="ion-padding-bottom">Seleziona un file per importare i tuoi dati preesistenti</p>
          <p className="ion-padding-bottom">
            <IonIcon icon={informationCircle} style={{ verticalAlign: 'middle' }} /> Non sai come formattare il file?{' '}
            <a href="#" onClick={handleTemplateDownload} style={{ fontWeight: 'bold' }}>
              Scarica il template
            </a>
          </p>
          <IonButton expand="block" color={'secondary'} onClick={() => openFileDialog()} className="ion-margin-bottom">
            <IonIcon icon={cloudUpload} slot="start" />
          </IonButton>
          {/* REF: https://forum.ionicframework.com/t/ioninput-type-file/205203/2 */}
          <input
            style={{ display: 'none' }}
            ref={inputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
          />
          <IonItem lines="none" className="ion-margin-bottom">
            <IonLabel>
              <strong>File Selezionato:</strong> {label}
            </IonLabel>
          </IonItem>

          <IonButton expand="block" onClick={() => handleUpload()} className="ion-margin-bottom">
            <IonIcon icon={addOutline} slot="start" />
            Aggiungi a Db
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonToast isOpen={toast !== null} onDidDismiss={() => setToast(null)} message={toast?.message} duration={3000} color={toast?.color} />
    </>
  );
};

export default ImportItem;
