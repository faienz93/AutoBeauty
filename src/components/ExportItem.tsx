import { useState } from 'react';
import { IonAlert, IonButton, IonIcon, IonItemDivider, IonToast } from '@ionic/react';
import { CsvService } from '../services/excel/csvParser';
import { Maintenance } from '../models/MaintenanceType';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { downloadOutline } from 'ionicons/icons';
import { getMaintenanceKey } from '../services/utils';



const ExportItem = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [noData, setNoData] = useState(false);
  
  const db = useMaintenanceDb();
  const csvService = new CsvService();

  const handleExport = async () => {

    try {
      
      const result = await db.allDocs({ include_docs: true });
      const data = result.rows.
      filter((value) => {
        // filtra solo i documenti che hanno une specifica chiave
        let key = getMaintenanceKey()
        return value.doc?._id.startsWith(key);
      })
      .map((row: any) => ({
        id: row.doc._id,
        ...row.doc
      }))
      console.log('Fetched docs:', result);
      
      if(data.length === 0){
        setNoData(true);
        return;
      }
        
      

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
        <IonIcon slot="icon-only" ios={downloadOutline}></IonIcon>
        Esporta
      </IonButton>

    

      <IonAlert
        isOpen={noData}
        header="Attenzione!"
        onDidDismiss={() => setNoData(prevValue => !prevValue)}
        message="Non ci sono dati da esportare."
        buttons={['Ok!']}
      ></IonAlert>
  

      {isSuccess ? (
        <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Caricamento avvenuto con successo" duration={1000}></IonToast>
      ) : (
        <IonToast trigger="open-toast" color="danger" message="Errore durante il caricamento" duration={1000}></IonToast>
      )}

    </>
  );
};

export default ExportItem;
