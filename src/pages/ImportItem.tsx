import React, { useRef, useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { getEnv } from '../services/env';
import { db } from '../firebase';
import { Header } from './Header';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonList } from '@ionic/react';
import { camera, cloudUpload } from 'ionicons/icons';

// const envVar = getEnv();

const ImportItem = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [label, setLabel] = useState("No Value Chosen");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setLabel(selectedFile.name);
    } else {
      setLabel("No Value Chosen");
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

    const batch = writeBatch(db);
    const collectionRef = collection(db, env.collection);

    data.forEach((item) => {
      const docRef = doc(collectionRef); // Create a new document reference
      batch.set(docRef, item);
    });

    console.log('Uploading data to Firebase...');
    console.log(batch);
    await batch.commit();

    alert('Data uploaded successfully');
  };

  return (
    <>
      <Header title="Importa" />
      <IonContent color="light">
        <input style={{ display: "none" }} ref={inputRef} type="file" accept=".json" onChange={handleFileChange} />

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
      </IonContent>
    </>
  );
};

export default ImportItem;
