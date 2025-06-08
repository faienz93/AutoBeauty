import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from "@ionic/react";
import { Maintenance } from "../models/MaintenanceType";
import { LimitGomme, LimitTagliando } from "../constant";
import { parseStringToDate } from "../services/utils";
import { useHistory } from 'react-router-dom';
import { useMaintenanceIcon } from "../hooks/useMaitenanceIcon";
import { pencil } from "ionicons/icons";
import { Card } from "../ui/Card";


export const CardMaintenance = ({ tipo, maintenance, maxMaintenanceKm, currentKm }: { tipo: string, maintenance: Maintenance, maxMaintenanceKm: number, currentKm: number }) => {
  console.log('Rendering CardMaintenance component');
  console.log('CURRRRRRRRRRRRRRRRRRRRRRRRRRRRENT KM:', currentKm, maxMaintenanceKm);


  const history = useHistory();
  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: Maintenance) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
      // search: '?update=true',  // query string
      state: {  // location state
        item: item,
      },
    })

  };


  const maxKm = Math.max(currentKm,maxMaintenanceKm);
  const diffKm = maxKm - maintenance.km;

  let daFare = false;
  if (tipo === 'Gomme') daFare = diffKm >= LimitGomme;
  if (tipo === 'Tagliando') daFare = diffKm >= LimitTagliando;
  if (tipo === 'Revisione') {
    const dataUltimaRevisione = parseStringToDate(maintenance?.data);
    const dataAttuale = new Date();
    const mesiPassati =
      (dataAttuale.getFullYear() - dataUltimaRevisione.getFullYear()) * 12 +
      (dataAttuale.getMonth() - dataUltimaRevisione.getMonth());

    daFare = mesiPassati >= 24; // 24 mesi = 2 anni
  }

  // Calcolo dei dati reali per la manutenzione
  const tipoManutenzione = tipo;
  const dataManutenzione = maintenance?.data || 'N/A';


  return (
    <Card
      key={maintenance._id}
      title={tipoManutenzione}
      subtitle={dataManutenzione}
      mainNote={daFare ? 'Da fare' : 'Tutto sotto controllo'}
      detailNote={String(maintenance.km)}
      comment={maintenance?.note || ''}
      shadowColor='#2f3133'
      iconContent={{
        type: 'image',
        source: useMaintenanceIcon(maintenance.tipo)
      }}
      mainNoteColor={daFare ? '#FF0000' : '#008000'}
      onEdit={() => handleEdit(maintenance)}
    />
  )
}
