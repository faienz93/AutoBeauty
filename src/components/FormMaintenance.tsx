import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonTextarea,
  IonNote,
  IonSelectOption,
  IonIcon,
  IonText,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import DataPickerPopup from '../components/DataPickerPopup';
import { add, pencilOutline } from 'ionicons/icons';
import { Maintenance, MaintenanceType, maintenanceTypes } from '../models/MaintenanceType';
import { useState } from 'react';
import { formatCost } from '../utils/carUtils';
import { getDateString, parseStringToDate } from '../utils/dateUtils';
import { getUUIDKey } from '../utils/pouchDBUtils';

const getInitialState = (editData?: Maintenance) => {
  return {
    _id: editData?._id ?? getUUIDKey(),
    _rev: editData?._rev ?? undefined,
    data: editData?.data ?? getDateString(),
    km: editData?.km ?? 0,
    tipo: (editData?.tipo as MaintenanceType) ?? 'Tagliando',
    costo: editData?.costo ?? 0,
    note: editData?.note ?? '',
  };
};

interface FormMaintenanceProps {
  editData?: Maintenance;
  children: React.ReactNode;
  onSubmit: (event: Maintenance) => void;
}

export const FormMaintenance = ({ editData, children, onSubmit }: FormMaintenanceProps) => {
  const [formData, setFormData] = useState<Maintenance>(getInitialState(editData));

  useIonViewWillEnter(() => {
    setFormData(getInitialState(editData));
  }, [editData]);

  // useIonViewDidEnter(() => {
  //
  // });

  // useIonViewDidLeave(() => {
  //
  // });

  useIonViewWillLeave(() => {
    setFormData({
      _id: undefined,
      _rev: undefined,
      data: getDateString(),
      km: 0,
      tipo: 'Tagliando' as MaintenanceType,
      costo: 0,
      note: '',
    });

    setDidEdit({
      data: false,
      km: false,
      tipo: false,
      costo: false,
      note: false,
    });
  });

  const [didEdit, setDidEdit] = useState({
    data: false,
    km: false,
    tipo: false,
    costo: false,
    note: false,
  });

  const isKmInvalid = didEdit.km && (Number(formData.km) === 0 || Number(formData.km) > 999999);
  const isCostoInvalid = didEdit.costo && (Number(formData.costo) === 0 || Number(formData.costo) > 999999);

  const onInputChange = (inputIdentifier: 'data' | 'km' | 'tipo' | 'costo' | 'note', newValue: any) => {
    if (inputIdentifier === 'data') {
      newValue = getDateString(newValue as Date);
    }

    if (inputIdentifier === 'costo') {
      newValue = formatCost(String(newValue));
    }

    setFormData((prevState) => ({
      ...prevState,
      [inputIdentifier]: newValue,
    }));

    setDidEdit((prevEdit) => ({
      ...prevEdit,
      [inputIdentifier]: true,
    }));
  };

  const onInputBlur = (identifier: 'data' | 'km' | 'tipo' | 'costo' | 'note') => {
    setDidEdit((prevEdit) => ({
      ...prevEdit,
      [identifier]: true,
    }));
  };

  function handleSubmit(event: any) {
    event.preventDefault();

    const mnt: Maintenance = {
      _id: formData._id,
      _rev: formData._rev,
      data: getDateString(parseStringToDate(formData.data)),
      km: Number(formData.km) || 0,
      tipo: formData.tipo as MaintenanceType,
      costo: Number(formData.costo) || 0,
      note: formData.note || '',
    };

    onSubmit({ ...mnt });
  }

  return (
    <IonContent color="light">
      <IonList inset={true}>
        <IonItem lines="inset" slot="header">
          <DataPickerPopup title="Scegli data" currentDate={formData.data} onChange={onInputChange} />
        </IonItem>
        <IonItem>
          <IonInput
            labelPlacement="floating"
            label="KM"
            type="number"
            name="km"
            onBlur={() => onInputBlur('km')}
            value={formData.km}
            onIonChange={(e) => onInputChange('km', e.detail.value)}
            min={0}
            max={999999}
          />
        </IonItem>
        <div style={{ padding: '0 16px' }}>
          <IonText color="danger" style={{ fontSize: '0.8em' }}>
            {isKmInvalid && <p style={{ margin: '4px 0' }}>Per favore inserisci un costo superiore a 0.</p>}
          </IonText>
        </div>
        <IonItem>
          <IonInput
            labelPlacement="floating"
            label="Costo (€)"
            type="text"
            inputmode="decimal"
            name="costo"
            onBlur={() => onInputBlur('costo')}
            value={formData.costo}
            onIonChange={(e) => onInputChange('costo', e.detail.value)}
            min={0}
            max={999999}
          />
        </IonItem>
        <div style={{ padding: '0 16px' }}>
          <IonText color="danger" style={{ fontSize: '0.8em' }}>
            {isCostoInvalid && <p style={{ margin: '4px 0' }}>Per favore inserisci un costo superiore a 0.</p>}
          </IonText>
        </div>
        <IonItem lines="inset" slot="header">
          <IonSelect
            labelPlacement="floating"
            label="Tipo"
            aria-label="Maintenance"
            interface="action-sheet"
            placeholder="Select Maintenance"
            name="type"
            value={formData.tipo}
            onBlur={() => onInputBlur('tipo')}
            onIonChange={(e) => onInputChange('tipo', e.detail.value)}>
            {maintenanceTypes.map((type) => (
              <IonSelectOption key={type} value={type}>
                {type}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonList>
      <IonNote color="medium" class="ion-margin-horizontal">
        Aggiungi eventuali note.
      </IonNote>
      <IonList inset={true}>
        <IonItem>
          <IonTextarea
            label="Commento"
            label-placement="floating"
            value={formData.note}
            rows={5}
            onIonChange={(e) => onInputChange('note', e.detail.value)}></IonTextarea>
        </IonItem>
      </IonList>

      {editData ? (
        <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleSubmit} disabled={isCostoInvalid || isKmInvalid}>
          <IonIcon slot="icon-only" ios={pencilOutline} md={pencilOutline}></IonIcon>
          Modifica Manutenzione
        </IonButton>
      ) : (
        <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleSubmit} disabled={isCostoInvalid || isKmInvalid}>
          <IonIcon slot="icon-only" ios={add} md={add}></IonIcon>
          Aggiungi Manutenzione
        </IonButton>
      )}

      {children}
    </IonContent>
  );
};
