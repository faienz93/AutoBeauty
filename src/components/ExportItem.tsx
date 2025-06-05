import React, { useContext, useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonToast } from '@ionic/react';
import { MaintenanceDbCtx } from '../App';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance } from '../models/MaintenanceType';



const ExportItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const db = useContext(MaintenanceDbCtx);
  const csvService = new CsvService();

  const handleExport = async () => {

    try {
      const info = await db.getInfo();
      if (info.doc_count === 0) {
        alert('Non ci sono dati da esportare');
        return;
      }
      const result = await db.allDocs({ include_docs: true });
      console.log('Fetched docs:', result);
      const data = result.rows.map((row: any) => ({
        id: row.doc._id,
        ...row.doc
      }));
      console.log(data);
      const csvDataBlob = await csvService.exportCsv(data as Maintenance[], [
        'data',
        'km',
        'tipo',
        'costo',
        'note']);
      console.log(csvDataBlob);

      // REF: https://dev.to/graciesharma/implementing-csv-data-export-in-react-without-external-libraries-3030
      const url = window.URL.createObjectURL(csvDataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `maintenance_${new Date().toISOString().slice(0, 10)}.csv`);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsSuccess(true);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      setIsSuccess(false);
    }

  };

  return (
    <>

      <IonItemDivider color="light" className='buttonAddList'>
        <h1>Esporta</h1>
      </IonItemDivider>

      <IonButton color="danger" expand="full" className="buttonAddList" onClick={handleExport}>
        Esporta
      </IonButton>

      {isSuccess ? (
        <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Caricamento avvenuto con successo" duration={1000}></IonToast>
      ) : (
        <IonToast trigger="open-toast" color="danger" message="Errore durante il caricamento" duration={1000}></IonToast>
      )}

    </>
  );
};

export default ExportItem;
