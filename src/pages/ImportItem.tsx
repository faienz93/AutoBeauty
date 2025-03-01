import React, { useRef, useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { getEnv } from '../services/env';
import { db } from '../firebase';
import { Header } from './Header';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonList, IonToast } from '@ionic/react';
import {v4 as uuidv4} from 'uuid';
import { cloudUpload } from 'ionicons/icons';



const ImportItem = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [label, setLabel] = useState('No Value Chosen');

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
    reader.onload = handleFileRead;
    reader.readAsText(file);

    const env = getEnv();
    if (!env) return;

    try {
      const batch = writeBatch(db);
      const collectionRef = collection(db, env.collection);

      data.forEach((item) => {
        const docRef = doc(collectionRef); // Create a new document reference
        batch.set(docRef, item);
      });

      console.log('Uploading data to Firebase...');
      console.log(batch);
      await batch.commit();

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
    }
  };

  return (
    <>
      <Header title="Importa" />
      <IonContent color="light">
        <input style={{ display: 'none' }} ref={inputRef} type="file" accept=".json" onChange={handleFileChange} />

        <IonButton onClick={openFileDialog} expand="full" className="buttonAddList">
          <IonIcon slot="icon-only" icon={cloudUpload}></IonIcon>
        </IonButton>
        <IonList inset={true}>
          <IonItem lines="inset">
            <IonInput disabled={true} clearInput={true} label={label}></IonInput>
          </IonItem>
        </IonList>

        <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleUpload}>
          Aggiungi a Firebase
        </IonButton>

        {isSuccess ? (
          <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Caricamento avvenuto con successo" duration={1000}></IonToast>
        ) : (
          <IonToast trigger="open-toast" color="danger" message="Errore durante il caricamento" duration={1000}></IonToast>
        )}
      </IonContent>
    </>
  );
};

export default ImportItem;
