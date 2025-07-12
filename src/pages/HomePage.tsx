import { useCallback, useContext } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonPage, useIonViewWillEnter } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from '../components/Header';

import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../services/utils';
import { LastKmFinded } from '../components/LastKmFinded';
import { useKilometersDb, useMaintenanceDb } from '../hooks/useDbContext';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';




const HomePage = () => {

  const [latestMaintenances, setLatestMaintenances] = useState({});
  const fetchMaintenances = useFetchMaintenances(); 

  const dbKm = useKilometersDb();
  const dbMaitenenance = useMaintenanceDb();

  const [maintenanceWithHigherKm, setMaintenanceWithHigherKm] = useState<Maintenance | null>(null);
  const [lastManualKm, setLastManualKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0
  });

  const today = getDateString();


  const countCarMaintenances = async () => {
    
    const maintenance = await fetchMaintenances()

    setMaintenanceWithHigherKm(
      maintenance.reduce((acc, current) => {
        if (!acc || current.km > acc.km) {
          return current;
        }
        return acc;
      }, null as Maintenance | null)
    );



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

    setLatestMaintenances(updatedMaintenances);

  };


  const getMax = (km: Kilometers, maintenance: Maintenance) => {
    if (km.km > maintenance.km)
      return km;
    return maintenance;
  };


  const getLatestManualKilometers = async () => {

    // const searchLastManualKm = await dbKm.find<Kilometers>({
    //     selector: {
    //         data: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
    //         //_id: { $gt: null }
    //     },
    //     sort: [{ data: 'asc' }], // ordina per km decrescente
    //     limit: 1, // prende solo il primo risultato
    //     //fields: ['km', 'data'],
    //     use_index: 'idx-data',
    // });

    // REF: https://pouchdb.com/api.html#create_document
    let lastKm: Kilometers = {
      _id: 'manual-km',
      // _rev: '',
      data: getDateString(),
      km: 0
    };

    try {
      const searchLastManualKm = await dbKm.get('manual-km');
      if (searchLastManualKm) {
        lastKm = {
          _id: searchLastManualKm._id || '',
          _rev: searchLastManualKm._rev || '',
          km: searchLastManualKm.km || 0,
          data: getDateString(parseStringToDate(searchLastManualKm.data)),
        };
      }

    } catch (err) {
      console.log(err);
    }


    console.log('searchLastManualKm', lastKm);


    // lastKm = searchLastManualKm.docs[0] || {};


    // 4. Imposto lo stato con il valore e la data massima
    setLastManualKm({
      _id: lastKm._id || '',
      _rev: lastKm._rev || '',
      km: lastKm.km || 0,
      data: getDateString(parseStringToDate(lastKm.data)),
    });


  };

  useIonViewWillEnter(() => {
    getLatestManualKilometers()
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
        <LastKmFinded lastManualKm={lastManualKm} maintenanceWithHigherKm={maintenanceWithHigherKm as Maintenance} />
        {latestMaintenances && Object.keys(latestMaintenances).length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          Object.entries(latestMaintenances).map(([tipo, maintenance]) => (
            <CardMaintenance key={tipo} tipo={tipo} maintenance={maintenance as Maintenance} maxKm={getMax(lastManualKm, maintenanceWithHigherKm as Maintenance).km} />
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
