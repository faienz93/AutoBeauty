import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { getEnv } from '../services/env';
import { db } from '../firebase';
import { Header } from './Header';

const envVar = getEnv();

const ImportItem = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleFileRead = (event: ProgressEvent<FileReader>) => {
    const content = event.target?.result;
    if (content) {
      const jsonData = JSON.parse(content as string);
      setData(jsonData);
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
    const collectionRef = collection(db, envVar?.collection);

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
      <div>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload to Firebase</button>
      </div>
    </>
  );
};

export default ImportItem;
