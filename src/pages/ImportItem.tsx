import React, { useContext, useRef, useState } from 'react';

import { getEnv } from '../services/env';
import { IonButton, IonIcon, IonInput, IonItem, IonItemDivider, IonList, IonToast } from '@ionic/react';
import { cloudUpload } from 'ionicons/icons';
import { CsvService } from '../services/csvParser';
import { DatabaseContext } from '../App';
import { Maintenance } from '../models/Maintenance';
const ImportItem = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const db = useContext(DatabaseContext);

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleFileRead = (event: ProgressEvent<FileReader>) => {
    const content = event.target?.result;
    if (content) {
      console.log(content)
      const jsonData = JSON.parse(content as string);
      setData(jsonData);
    }
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    // reader.onload = handleFileRead;
    reader.readAsText(file);

    const env = getEnv();
    if (!env) return;

    try {
      const res = await csvService.importCsv(file) as Maintenance[];
      console.log("VEDIAMO COSA STAMPARE")
      console.log(res)
      try {
        await db.bulkDocs(res);
        setIsSuccess(true);
      } catch (error) {
        console.error('Error during bulk upload:', error);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
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

      {isSuccess ? (
        <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Caricamento avvenuto con successo" duration={1000}></IonToast>
      ) : (
        <IonToast trigger="open-toast" color="danger" message="Errore durante il caricamento" duration={1000}></IonToast>
      )}

    </>
  );
};

export default ImportItem;
