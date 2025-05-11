import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { LastKm, Maintenance, maintenanceTypes, Stats } from '../models/Maintenance';
import { IonContent, IonCard, IonText, IonButton, IonIcon } from '@ionic/react';
import { IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from './Header';
import { DatabaseContext } from '../App';
import { CardMaintenance } from './CardMaintenance';
import { useHistory } from 'react-router-dom';
import { pencil } from 'ionicons/icons';



const HomePage = () => {
  const [countMaintenances, setCountMaintenances] = useState(0);
  const [latestMaintenances, setLatestMaintenances] = useState({});
  const [lastKm, setLastKm] = useState<LastKm>({
    data:  new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    km: 0
  });
  const db = useContext(DatabaseContext);
  const today = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const history = useHistory();

  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (lastKm: LastKm) => {
    history.push({
      pathname: `/newkm/edit/${lastKm._id}`,
      // search: '?update=true',  // query string
      state: {  // location state
        item: lastKm, 
      },
    })
    
  };
  const getLatestMaintenances = async () => {

    const itemByKmAndData = await db.find<Maintenance>({
      selector: {
        km: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
        _id: { $gt: null } // assicura che il documento esista
      },
      sort: [{ km: 'desc' }], // ordina per km decrescente
      limit: 1, // prende solo il primo risultato
      fields: ['km', 'data'] // opzionale: prende solo i campi necessari
    });

    const lastKm = itemByKmAndData.docs[0];
    console.log('Ultimo chilometraggio:', lastKm);
    setLastKm({
      data: lastKm.data,
      km: lastKm?.km || 0
    });

    

    const promises = maintenanceTypes.map(async (maintenanceType) => {
      const res = await db.find<Maintenance>({
        selector: {
          tipo: maintenanceType,
          data: { $gt: null }
        },
        sort: [{ data: 'desc' }],
        limit: 1
      });

      return { type: maintenanceType, doc: res.docs[0] || null };
    });

    const results = await Promise.all(promises)

    const updatedMaintenances = results.reduce((acc, result) => ({
      ...acc,
      [result.type]: result.doc
    }), {}) as Stats;

    setLatestMaintenances(updatedMaintenances);
  };



  const countCarMaintenances = async () => {
    const res = await db.getInfo();
    console.log(res.doc_count);
    setCountMaintenances(res.doc_count);
  };

  useEffect(() => {
    const fetchData = async () => {
      await countCarMaintenances();
      await getLatestMaintenances();
    };
    fetchData();

    console.log(countMaintenances);
    console.log(latestMaintenances);
  }, []);

  useEffect(() => {
    console.log("latestMaintenances updated:", latestMaintenances);
  }, [latestMaintenances]);


  return (
    <>
      <Header title="Home" showBackButton={false} />
      <IonContent fullscreen={true}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}>
          <IonCard style={{ flexGrow: 1 }}>
            <IonCardHeader>
              <IonCardTitle>Data odierna</IonCardTitle>
              <IonCardSubtitle>{today}</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard style={{ flexGrow: 1 }}>
            <IonCardHeader>
              <IonCardTitle>Ultimo Km</IonCardTitle>
              <IonCardSubtitle>{lastKm.data}: <strong>{lastKm.km}</strong></IonCardSubtitle>
              <IonButton fill="clear" onClick={() => handleEdit(lastKm)}>
                                <IonIcon icon={pencil} /> Modifica
                              </IonButton>
            </IonCardHeader>
          </IonCard>
        </div>

        {countMaintenances == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          Object.entries(latestMaintenances).map(([tipo, maintenance]) => (
            <CardMaintenance key={tipo} tipo={tipo} maintenance={maintenance as Maintenance} />
          ))
        )}
      </IonContent>
    </>
  );
};

export default HomePage;
