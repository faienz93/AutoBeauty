import React, { useContext, useEffect, useRef, useState } from 'react';
import { IonContent, IonThumbnail, IonItem, IonLabel, IonList, IonIcon, IonText, IonButton, IonBadge, useIonViewWillEnter, useIonViewWillLeave, IonPage } from '@ionic/react';

// import './homepage.css';
import tagliandoImg from '../assets/maintenance.svg';
import tireImg from '../assets/tire.svg';
import repairImg from '../assets/car-repair.svg';
import carImg from '../assets/car.svg';
import { Maintenance, MaintenanceType } from '../models/Maintenance';
import { calendarOutline, pencil, trashOutline } from 'ionicons/icons';
import { AlertConfirmation } from './AlertConfirmation';
import { getEnv } from '../services/env';
import { Header } from './Header';

// Database
import { SqliteServiceContext, StorageServiceContext } from '../App';
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { platform } from '../App';
import { useQuerySQLite } from '../hooks/UseQuerySQLite';

const envVar = getEnv();

function ListCarMaintenance() {
  // All'interno del tuo componente:
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);


  // Database
  const ref = useRef(false);
  const isInitComplete = useRef(false);
  const [db, setDb] = useState<SQLiteDBConnection | null>(null);
  const sqliteServ = useContext(SqliteServiceContext);
  const storageServ = useContext(StorageServiceContext);
  const dbNameRef = useRef('');

  const openDatabase = () => {
    try {
      const dbMaintenanceName = storageServ.getDatabaseName();
      dbNameRef.current = dbMaintenanceName;
      const version = storageServ.getDatabaseVersion();

      sqliteServ.openDatabase(dbMaintenanceName, version, false).then((database) => {
        setDb(database);
        ref.current = true;
      });
    } catch (error) {
      const msg = `Error open database:: ${error}`;
      console.error(msg);
      alert(msg);
    }
  }

  // const fetchMaintenances = async () => {
  //   const querySnapshot = await getDocs(collection(db, envVar?.collection));
  //   const data = querySnapshot.docs.map((doc) => ({
  //     ...(doc.data() as Maintenance),
  //   }));
  //   setMaintenances(data);
  // };

  // const deleteDocumente = async (id: string) => {
  //   await deleteDoc(doc(db, envVar?.collection, id));
  //   fetchMaintenances()
  // };

  // useEffect(() => {
  //   fetchMaintenances();

  //   console.log(maintenances);
  // }, []);

  const handleDeleteMaintenance = async (maintenanceId: number) => {
    if (db) {
      const isConn = await sqliteServ.isConnection(dbNameRef.current, false);
      await storageServ.deleteMaintenanceById(maintenanceId.toString());
      // Update the maintenance state by filtering out the deleted maintenance
      setMaintenances(prevMaintenance => prevMaintenance.filter(maintenance => maintenance.id !== maintenanceId));
    }
  };



  const getMaintenanceIcon = (type: MaintenanceType): string => {
    switch (type) {
      case 'Tagliando':
        return tagliandoImg;
      case 'Gomme':
        return tireImg;
      case 'Revisione':
        return repairImg;
      default:
        return carImg;
    }
  };


  useIonViewWillEnter(() => {
    console.log('useIonViewWillEnter -------------------------------------------');
    const initSubscription = storageServ.isInitCompleted.subscribe((value) => {
      console.log('isInitCompleted', value);
      isInitComplete.current = value;
      if (isInitComplete.current === true) {
        const dbUsersName = storageServ.getDatabaseName();
        console.log('--- dbUsersName ---');
        console.log(dbUsersName);
        if (ref.current === false) {
          if (platform === "web") {
            window.addEventListener('beforeunload', (event) => {

              sqliteServ.closeDatabase(dbNameRef.current, false).then(() => {
                ref.current = false;
              })
                .catch((error) => {
                  const msg = `Error close database:: ${error}`;
                  console.error(msg);
                  alert(msg);
                });
            });
            customElements.whenDefined('jeep-sqlite').then(() => {
              openDatabase();
            })
              .catch((error) => {
                const msg = `Error open database:: ${error}`;
                console.log(`msg`);
                alert(msg);
              });

          } else {
            openDatabase();
          }
        }
      }
    });

    return () => {
      initSubscription.unsubscribe();
    };
  }, [storageServ]);


  useIonViewWillLeave(() => {
    sqliteServ.closeDatabase(dbNameRef.current, false).then(() => {
      ref.current = false;
    })
      .catch((error) => {
        const msg = `Error close database:: ${error}`;
        console.error(msg);
        alert(msg);
      });
  });

  useEffect(() => {
    // Fetch users from the database using useQuerySQLite hook
    console.log("useEffect");
    if (isInitComplete.current === true && db) {
      console.log("DB is open");
      const stmt = `SELECT * FROM ${envVar?.car_table}`;
      console.log(stmt)
      const values: any[] = [];
      const fetchData = useQuerySQLite(db, stmt, values);
      fetchData()
        .then((fetchedUserData) => {
          console.log("---- fetchedUserData -----");
          console.log(fetchedUserData);
          // setUsers(fetchedUserData);
          setMaintenances(fetchedUserData);
        })
        .catch((error) => {
          const msg = `Error fetching user data: ${error}`;
          console.error(msg);
          alert(msg);
        });
    }
  }, [db]);

  return (
    <IonPage>
      <Header title="List Maintenance" />
      <IonContent color="light" fullscreen={true}>
        {maintenances.length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          <IonList inset={true}>
            {maintenances.map((item, index) => (
              <IonItem key={index}>
                <IonThumbnail slot="start">
                  {/* <img src={`/assets/${item.image}`} alt={item.name} /> */}
                  <img src={getMaintenanceIcon(item.tipo)} alt={item.tipo} />
                </IonThumbnail>
                <IonLabel>
                  <h2>{item.tipo}</h2>
                  <IonText>
                    <p>
                      <IonIcon icon={calendarOutline} />
                      {item.data}
                    </p>
                  </IonText>

                  {/* Rating (★ Star icons) */}
                  {/* <p>
                  {Array.from({ length: 5 }, (_, i) => (
                    <IonIcon key={i} icon={i < 3 ? star : starOutline} color="warning" />
                  ))}
                </p> */}

                  {/* KM */}
                  <IonBadge color={'primary'}>KM {item.km}</IonBadge>
                  <p>{item.note}</p>
                </IonLabel>

                {/* Price & Cart Button */}
                <IonText slot="end">
                  <h2>€ {item.costo}</h2>
                </IonText>

                <IonButton fill="clear" slot="end" onClick={() => alert('Edit')}>
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" id="present-alert" slot="end" onClick={() => setConfirmDelete(true)}>
                  <IonIcon icon={trashOutline} color="danger" />
                </IonButton>
                <AlertConfirmation
                  trigger="resent-alert"
                  isOpen={confirmDelete}
                  onClose={() => setConfirmDelete(false)}
                  onConfirm={() => handleDeleteMaintenance(item.id)}
                />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ListCarMaintenance;
