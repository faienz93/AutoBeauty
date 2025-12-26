import { useCallback, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { Maintenance, MaintenanceWithStatus, Stats } from '../types/MaintenanceType';
import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import { Header } from '../components/Header';
import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../types/KilometersType';
import { calculateDaysSinceLastMaintenance, getDateToString, getStringToDate } from '../utils/dateUtils';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';
import { getMaintenanceWithHigherKm, getGroupByMaintenanceByKm, getMaxKmBetween } from '../utils/business';
import { useFetchManualKm } from '../hooks/useFetchManualKm';
import PageHeader from '../ui/PageHeader';
import Loader from '../ui/Loader';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [lastManualKm, setLastManualKm] = useState<Kilometers>({
    data: getDateToString(),
    km: 0,
  });

  const fetchMaintenances = useFetchMaintenances();
  const fetchManualKm = useFetchManualKm();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const maxMaintenanceKm = useMemo(() => {
    return getMaintenanceWithHigherKm(maintenances);
  }, [maintenances]);

  const groupByMaintenance = useMemo(() => {
    const maxBetweenManualAndHighestKm = getMaxKmBetween(lastManualKm.km, maxMaintenanceKm);

    return getGroupByMaintenanceByKm(maintenances, maxBetweenManualAndHighestKm);
  }, [maintenances, lastManualKm.km, maxMaintenanceKm]) as Stats;

  const isWrongKilometers = useMemo(() => lastManualKm.km < maxMaintenanceKm, [maxMaintenanceKm, lastManualKm.km]);

  const isMaitenanceNeeded = useMemo(() => {
    return Object.values(groupByMaintenance ?? {}).some((maintenance) => maintenance?.isNeeded);
  }, [groupByMaintenance]);

  const loadData = useCallback(async () => {
    try {
      const [maintenancesData, manualKmData] = await Promise.all([fetchMaintenances(), fetchManualKm()]);

      setMaintenances(maintenancesData);
      setLastManualKm({
        _id: manualKmData._id || '',
        _rev: manualKmData._rev || '',
        km: manualKmData.km || 0,
        data: getDateToString(getStringToDate(manualKmData.data)),
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchMaintenances, fetchManualKm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useIonViewWillEnter(() => {
    loadData();
  });

  if (loading) return <Loader />;

  return (
    <IonPage>
      <Header title="Home" showBackButton={false} />
      <IonContent>
        <PageHeader
          totalMaintenances={maintenances.length}
          lastManualKm={lastManualKm.km}
          maxMaintenanceKm={maxMaintenanceKm}
          daysSinceLastMaintenance={maintenances.length > 0 ? calculateDaysSinceLastMaintenance(maintenances[0]?.data) : 0}
          isMaitenanceNeeded={isMaitenanceNeeded}
          hasMaintenances={maintenances.length > 0}
          isWrongKilometers={isWrongKilometers}>
          {maintenances.length > 0 &&
            Object.entries(groupByMaintenance ?? {}).map(([category, maintenance]) => (
              <CardMaintenance key={category} category={category} maintenance={maintenance as MaintenanceWithStatus} />
            ))}
        </PageHeader>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
