import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonButton, IonIcon } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from './Header';
import { KilometersDbCtx, MaintenanceDbCtx } from '../App';
import { CardMaintenance } from './CardMaintenance';
import { useHistory } from 'react-router-dom';
import { pencil } from 'ionicons/icons';
import { Kilometers } from '../models/KilometersType';
import { getDateString, getMaintenanceKey } from '../services/utils';



const HomePage = () => {
  const [countMaintenances, setCountMaintenances] = useState(0);
  const [latestMaintenances, setLatestMaintenances] = useState({});
  const [currentKm, setLastKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0
  });
  const dbMaitenenance = useContext(MaintenanceDbCtx);
  const dbKm = useContext(KilometersDbCtx);
  const today = getDateString();

  const history = useHistory();

  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (lastKm: Kilometers) => {
    history.push({
      pathname: `/newkm/edit/${lastKm._id}`,
      // search: '?update=true',  // query string
      state: {  // location state
        item: lastKm,
      },
    })

  };
  const getLatestMaintenances = async () => {

    const searchMaintentenanceByKm = await dbMaitenenance.find<Maintenance>({
      selector: {
        km: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
        _id: { $gt: null } // assicura che il documento esista
      },
      sort: [{ km: 'desc' }], // ordina per km decrescente
      limit: 1, // prende solo il primo risultato
      fields: ['km', 'data'] // opzionale: prende solo i campi necessari
    });

    const searchLastKm = await dbKm.find<Kilometers>({
      selector: {
        km: { $gte: 0 }, // prende tutti i km maggiori o uguali a 0
        _id: { $gt: null } // assicura che il documento esista
      },
      sort: [{ km: 'desc' }], // ordina per km decrescente
      limit: 1, // prende solo il primo risultato
      fields: ['km', 'data'] // opzionale: prende solo i campi necessari
    });

    // 1. Estraggo km e data con default a 0 / stringa odierna
    const lastMaintenance = searchMaintentenanceByKm.docs[0] || {};
    const lastKm = searchLastKm.docs[0] || {};
    const kmMaint = lastMaintenance.km ?? 0;
    const kmLast = lastKm.km ?? 0;
    const dataMaint = lastMaintenance.data ?? getDateString();
    const dataLast = lastKm.data ?? getDateString();
    // 2. Calcolo il chilometraggio massimo
    const maxKm = Math.max(kmMaint, kmLast);
    // 3. Determino la data corrispondente al massimo
    const maxData = (kmMaint >= kmLast) ? dataMaint : dataLast;
    // 4. Imposto lo stato con il valore e la data massima
    setLastKm({
      km: maxKm,
      data: maxData
    });
  };



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
    })) as Maintenance[];

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
      await getLatestMaintenances();
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

        <IonCard color='tertiary'>
          <IonCardHeader style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            // justifyContent: 'space-between' 
          }}>
            <IonCardTitle>Ultimo Km</IonCardTitle>
            <IonCardSubtitle>{currentKm.data}: <strong>{currentKm.km}</strong></IonCardSubtitle>
            <IonButton style={{ color: 'white' }} fill="clear" onClick={() => handleEdit(currentKm)}>
              <IonIcon icon={pencil} /> Modifica
            </IonButton>
          </IonCardHeader>
        </IonCard>


        {countMaintenances == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          Object.entries(latestMaintenances).map(([tipo, maintenance]) => (
            <CardMaintenance key={tipo} tipo={tipo} maintenance={maintenance as Maintenance} currentKm={currentKm.km} />
          ))
        )}
      </IonContent>
    </>
  );
};

export default HomePage;
