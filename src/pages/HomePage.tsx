import { useCallback, useContext} from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonPage, useIonViewWillEnter } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from '../components/Header';

import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../models/KilometersType';
import { getDateString, getMaintenanceKey, parseStringToDate } from '../services/utils';
import { LastKmFinded } from '../components/LastKmFinded';
import { useKilometersDb, useMaintenanceDb } from '../hooks/useDbContext';



const HomePage = () => {

  const [latestMaintenances, setLatestMaintenances] = useState({});

  const dbKm = useKilometersDb();
  const dbMaitenenance = useMaintenanceDb();

  const [maxKm, setMaxKm] = useState(0);
  const [lastKm, setLastKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0
  });

  const today = getDateString();


  const countCarMaintenances = async () => {
    const res = await dbMaitenenance.allDocs({ include_docs: true });

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


      setMaxKm(Math.max(...maintenance.map(m => m.km)));


    const updatedMaintenances = maintenance.reduce((acc, current) => {
      const existing = acc[current.tipo];

      // Se non esiste una manutenzione per questo tipo O
      // se la manutenzione corrente è più recente, aggiorna
      if (!existing ||
        new Date(parseStringToDate(current.data)).getTime() >
        new Date(parseStringToDate(existing.data)).getTime()) {
        acc[current.tipo] = current;
      }

      return acc;
    }, {} as Stats);

    console.log('Fetched docs:', maintenance);
    setLatestMaintenances(updatedMaintenances);

  };


  const getLatestKilometers = async () => {

    const searchLastKm = await dbKm.find<Kilometers>({
        selector: {
            data: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
            //_id: { $gt: null }
        },
        sort: [{ data: 'asc' }], // ordina per km decrescente
        limit: 1, // prende solo il primo risultato
        //fields: ['km', 'data'],
        use_index: 'idx-data',
    });

    console.log('searchLastKm', searchLastKm);

    
    const lastKm = searchLastKm.docs[0] || {};

    
    // 4. Imposto lo stato con il valore e la data massima
    setLastKm({
        _id: lastKm._id || '',
        _rev: lastKm._rev || '',
        km: lastKm.km || 0,
        data: getDateString(parseStringToDate(lastKm.data)),
    });
};

  useIonViewWillEnter(() => {
    getLatestKilometers()
    countCarMaintenances();
  });


  return (
    <IonPage>
      <Header title="Home" showBackButton={false} />
      <IonContent>
        <IonCard style={{ flexGlow: 1, borderRadius: 18, boxShadow: `0 4px 12px` }}>
          <IonCardHeader>
            <IonCardTitle>Data odierna</IonCardTitle>
            <IonCardSubtitle>{today}</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        <LastKmFinded currentKm={lastKm} />
        {latestMaintenances && Object.keys(latestMaintenances).length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          Object.entries(latestMaintenances).map(([tipo, maintenance]) => (
            <CardMaintenance key={tipo} tipo={tipo} maintenance={maintenance as Maintenance} maxMaintenanceKm={maxKm} currentKm={lastKm.km} />
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
