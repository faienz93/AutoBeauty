import { useCallback, useContext, useEffect } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonButton, IonIcon } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from '../components/Header';
import { KilometersDbCtx, MaintenanceDbCtx } from '../App';
import { CardMaintenance } from '../components/CardMaintenance';
import { useHistory } from 'react-router-dom';
import { pencil } from 'ionicons/icons';
import { Kilometers } from '../models/KilometersType';
import { getDateString, getMaintenanceKey, parseStringToDate } from '../services/utils';
import { LastKmFinded } from '../components/LastKmFinded';



const HomePage = () => {
  const [countMaintenances, setCountMaintenances] = useState(0);
  const [latestMaintenances, setLatestMaintenances] = useState({});

  const dbMaitenenance = useContext(MaintenanceDbCtx);

  const [lastKm, setLastKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0
  });

  const handleKmUpdate = useCallback((km: Kilometers) => {
    setLastKm(km);
  }, []);

  const today = getDateString();


  const countCarMaintenances = async () => {
    const res = await dbMaitenenance.allDocs({ include_docs: true });
    console.log('Fetched docs:', res);
    const maintenance = res.rows.
      filter((value) => {
        // filtra solo i documenti che hanno une specifica chiave
        let key = getMaintenanceKey()
        return value.doc?._id.startsWith(key);
      })
      .map((row: any) => ({
        id: row.doc._id,
        ...row.doc
      }))
      .sort((a: Maintenance, b: Maintenance) => {
        // Ordina per data decrescente
        return new Date(parseStringToDate(b.data)).getTime() - new Date(parseStringToDate(a.data)).getTime();

        // Oppure per km decrescente
        // return b.km - a.km;
      }) as Maintenance[];

    const updatedMaintenances = maintenance.reduce((acc, result) => ({
      ...acc,
      [result.tipo]: result as Maintenance
    }), {}) as Stats;

    setLatestMaintenances(updatedMaintenances);
    setCountMaintenances(maintenance.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      await countCarMaintenances();

    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("latestMaintenances updated:", latestMaintenances);
  }, [latestMaintenances]);


  return (
    <>
      <Header title="Home" showBackButton={false} />
      <IonContent>

        <IonCard style={{ flexGrow: 1 }}>
          <IonCardHeader>
            <IonCardTitle>Data odierna</IonCardTitle>
            <IonCardSubtitle>{today}</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>

        <LastKmFinded onKmUpdate={handleKmUpdate} />


        {countMaintenances == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          Object.entries(latestMaintenances).map(([tipo, maintenance]) => (
            <CardMaintenance key={tipo} tipo={tipo} maintenance={maintenance as Maintenance} currentKm={lastKm.km} />
          ))
        )}
      </IonContent>
    </>
  );
};

export default HomePage;
