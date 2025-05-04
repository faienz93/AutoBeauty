import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Maintenance, maintenanceTypes, Stats } from '../models/Maintenance';
import { IonContent, IonCard, IonText } from '@ionic/react';
import { IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from './Header';
import { DatabaseContext } from '../App';
import { CardMaintenance } from './CardMaintenance';



const HomePage = () => {
  const [countMaintenances, setCountMaintenances] = useState(0);
  const [latestMaintenances, setLatestMaintenances] = useState({});
  const db = useContext(DatabaseContext);
  const today = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getLatestMaintenances = async () => {

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
  }, [latestMaintenances]); // Si attiva solo quando latestMaintenances cambia


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
