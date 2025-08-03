import React, { useRef, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonInput, IonItem, IonLabel, IonList, IonToast } from '@ionic/react';
import { addOutline, cloudUpload } from 'ionicons/icons';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance, MaintenanceType } from '../models/MaintenanceType';
import { getDateString, parseStringToDate, parseItalianNumber } from '../utils/dateUtils';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { getUUIDKey } from '../utils/pouchDBUtils';

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
      const importedItemFromCsv = await csvService.importCsv(file) as Maintenance[];

      // Parse result
      const convertedItems: Maintenance[] = importedItemFromCsv.map(item => ({
        _id: getUUIDKey(),
        data: getDateString(parseStringToDate(item.data)),
        km: parseItalianNumber(item.km),        // gestisce numeri con virgola italiana
        tipo: item.tipo as MaintenanceType,
        costo: parseItalianNumber(item.costo),  // gestisce numeri con virgola italiana
        note: item.note || ''
      }));

      const result = await db.bulkDocs(convertedItems);
      if (result) {
        setIsSuccess(prevValue => !prevValue);
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

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Importa</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p className="ion-padding-bottom">
            Seleziona un file per importare i tuoi dati preesistenti
          </p>
          <IonButton
            expand="block"
            color={'secondary'}
            onClick={() => openFileDialog()}
            className="ion-margin-bottom">
            <IonIcon icon={cloudUpload} slot="start" />
          </IonButton>
          {/* REF: https://forum.ionicframework.com/t/ioninput-type-file/205203/2 */}
          <input style={{ display: 'none' }} ref={inputRef} type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
          <IonItem lines="none" className="ion-margin-bottom">
            <IonLabel>
              <strong>File Selezionato:</strong> {label}
            </IonLabel>
          </IonItem>

          <IonButton
            expand="block"
            onClick={() => handleUpload()}
            className="ion-margin-bottom">
            <IonIcon icon={addOutline} slot="start" />
            Aggiungi a Db
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonToast
        isOpen={isSuccess}
        onDidDismiss={() => setIsSuccess(prevValue => !prevValue)}
        message={isSuccess ? 'Caricamento avvenuto con successo' : 'Errore durante il caricamento'}
        duration={3000}
        color={isSuccess ? 'success' : 'danger'}
      />
    </>
  );
};

export default ImportItem;
