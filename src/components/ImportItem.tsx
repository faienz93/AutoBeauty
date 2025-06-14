import React, { useRef, useState } from 'react';

import { getEnv } from '../services/env';
import { IonButton, IonIcon, IonInput, IonItem, IonItemDivider, IonList, IonToast } from '@ionic/react';
import { cloudUpload } from 'ionicons/icons';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance, MaintenanceType } from '../models/MaintenanceType';
import { getDateString, getUUIDKey, parseStringToDate, parseItalianNumber } from '../services/utils';
import { useMaintenanceDb } from '../hooks/useDbContext';

interface ToastState {
  isSuccess: boolean;
  show: boolean;
}


const ImportItem = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const db = useMaintenanceDb();

  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<ToastState>({
    isSuccess: false,
    show: false
  });
  const [label, setLabel] = useState('No Value Chosen');
  const csvService = new CsvService();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setLabel(selectedFile.name);
    } else {
      setLabel('No Value Chosen');
    }
  };

  

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // const reader = new FileReader();
    // // reader.onload = handleFileRead;
    // reader.readAsText(file);

    // setToast({ isSuccess: false, show: false });

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
      if(result) {
        setToast({ isSuccess: true, show: true });
      }
      
    } catch (error) {
      console.error(error);
      setToast({ isSuccess: false, show: true });
    }
  };

  return (
    <>
      <IonItemDivider color="light" className='buttonAddList'>
          <h1>Importa</h1>
        </IonItemDivider>
      {/* REF: https://forum.ionicframework.com/t/ioninput-type-file/205203/2 */}
      <input style={{ display: 'none' }} ref={inputRef} type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />

      <IonButton onClick={openFileDialog} expand="full" className="buttonAddList">
        <IonIcon slot="icon-only" icon={cloudUpload}></IonIcon>
      </IonButton>
      <IonList inset={true}>
        <IonItem lines="inset">
          <IonInput disabled={true} clearInput={true} label={label}></IonInput>
        </IonItem>
      </IonList>

      <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleUpload}>
        Aggiungi a DB
      </IonButton>

      {toast.isSuccess && ( 
        <IonToast
        isOpen={toast.show}
        onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.isSuccess ? "Caricamento avvenuto con successo" : "Errore durante il caricamento"}
        duration={3000}
        color={toast.isSuccess ? "success" : "danger"}
      /> )}
      
      

    </>
  );
};

export default ImportItem;
