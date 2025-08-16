import React, { useRef, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonInput, IonItem, IonLabel, IonList, IonToast } from '@ionic/react';
import { addOutline, cloudUpload } from 'ionicons/icons';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance, MaintenanceType } from '../models/MaintenanceType';
import { getDateString, parseStringToDate, parseItalianNumber } from '../utils/dateUtils';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { getUUIDKey } from '../utils/pouchDBUtils';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { convertBlobToBase64, downloadFile } from '../utils/csvUtils';

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
  const [isSuccess, setIsSuccess] = useState(false);
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
        data: getDateString(parseStringToDate(item.data)),
        km: parseItalianNumber(item.km), // gestisce numeri con virgola italiana
        tipo: item.tipo as MaintenanceType,
        costo: parseItalianNumber(item.costo), // gestisce numeri con virgola italiana
        note: item.note || '',
      }));

      const result = await db.bulkDocs(convertedItems);
      if (result) {
        setIsSuccess((prevValue) => !prevValue);
        setFile(null);
        setLabel('Nessun File scelto');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setFile(null);
      setLabel('Nessun File scelto');
    }
  };

  const handleExport = async () => {
    try {
      const csvDataBlob = await csvService.exportCsvWithBlob(data as Maintenance[], ['data', 'km', 'tipo', 'costo', 'note']);

      const base64Data = (await convertBlobToBase64(csvDataBlob)) as string;

      const filename = `template.csv`;
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
          <IonCardTitle>Importa</IonCardTitle>
        </IonCardHeader>
        <p>
          Here is a link <a onClick={handleExport}>PROVA</a>
        </p>
        <IonCardContent>
          <p className="ion-padding-bottom">Seleziona un file per importare i tuoi dati preesistenti</p>
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
      <IonToast
        isOpen={isSuccess}
        onDidDismiss={() => setIsSuccess((prevValue) => !prevValue)}
        message={isSuccess ? 'Caricamento avvenuto con successo' : 'Errore durante il caricamento'}
        duration={3000}
        color={isSuccess ? 'success' : 'danger'}
      />
    </>
  );
};

export default ImportItem;
