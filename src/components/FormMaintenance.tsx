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
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import DataPickerPopup from '../components/DataPickerPopup';
import { Maintenance, MaintenanceType, maintenanceTypes } from '../types/MaintenanceType';
import { getDateToString, getStringToDate } from '../utils/dateUtils';
import { getUUIDKey } from '../utils/pouchDBUtils';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const getInitialState = (editData?: Maintenance) => {
  return {
    _id: editData?._id ?? getUUIDKey(),
    _rev: editData?._rev ?? undefined,
    data: editData?.data ?? getDateToString(),
    km: editData?.km ?? 0,
    tipo: (editData?.tipo as MaintenanceType) ?? 'Tagliando',
    costo: editData?.costo ?? 0,
    note: editData?.note ?? '',
  };
};

interface IFormInputs {
  datapicker: string;
  km: number;
  costo: number;
  data: Date;
  type: MaintenanceType;
  note: string;
}

interface FormMaintenanceProps {
  editData?: Maintenance;
  children: React.ReactNode;
  ciao: (event: Maintenance) => void;
}

// REF: https://dev.to/ionic/using-react-hook-form-with-ionic-react-components-update-1463
// REF: https://react-hook-form.com/get-started#IntegratingControlledInputs
export const FormMaintenance = ({ editData, children, ciao }: FormMaintenanceProps) => {
  const initialData = getInitialState(editData);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      km: initialData.km,
      costo: initialData.costo,
      datapicker: initialData.data,
      type: initialData.tipo,
      note: initialData.note,
    },
  });

  useIonViewWillEnter(() => {
    const newData = getInitialState(editData);
    reset({
      km: newData.km,
      costo: newData.costo,
      datapicker: newData.data,
      type: newData.tipo,
      note: newData.note,
    });
  }, [editData, reset]);

  useIonViewWillLeave(() => {
    reset({
      km: 0,
      costo: 0,
      datapicker: getDateToString(),
      type: 'Tagliando',
      note: '',
    });
  });

  const onSubmitForm: SubmitHandler<IFormInputs> = (formData) => {
    const { _id, _rev } = getInitialState(editData);

    const mnt: Maintenance = {
      _id: _id,
      _rev: _rev,
      data: getDateToString(getStringToDate(formData.datapicker)),
      km: Number(formData.km) || 0,
      tipo: formData.type as MaintenanceType,
      costo: Number(formData.costo) || 0,
      note: formData.note || '',
    };

    console.log('Form submitted:', mnt);
    ciao(mnt);
  };

  return (
    <IonContent color="light">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <IonList inset={true}>
          {/* Data Picker */}
          <IonItem lines="inset" slot="header">
            <Controller
              render={({ field }) => (
                <DataPickerPopup
                  name="datapicker"
                  title="Scegli data"
                  currentDate={field.value}
                  onChange={(date: Date) => field.onChange(getDateToString(date))}
                  // onChange={(date: Date) => console.log(date)}
                />
              )}
              control={control}
              name="datapicker"
              rules={{
                required: 'La data è obbligatoria',
                validate: {
                  notFuture: (value) => {
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    console.log(today);
                    return getStringToDate(value) < today || 'La data non può essere nel futuro';
                  },
                },
              }}
            />
          </IonItem>
          <ErrorMessage errors={errors} name="datapicker" as={<IonNote color="danger" style={{ padding: '0 16px', fontSize: '0.8em' }} />} />

          {/* KM */}
          <IonItem>
            <Controller
              render={({ field }) => (
                <IonInput
                  labelPlacement="floating"
                  label="KM"
                  type="text"
                  name="km"
                  value={field.value}
                  onIonChange={(e) => {
                    const value = parseInt(e.detail.value!) || 0;
                    field.onChange(value);
                  }}
                  onIonBlur={() => {
                    field.onBlur();

                    if (field.value > 1000) {
                      field.onChange(field.value.toLocaleString('it-IT'));
                    }
                  }}
                  helperText={field.value > 0 ? `${field.value.toLocaleString('it-IT')} km` : undefined}
                  className={errors.km ? 'ion-invalid ion-touched' : ''}
                />
              )}
              control={control}
              name="km"
              rules={{
                required: 'Il campo KM è obbligatorio',
                min: {
                  value: 1,
                  message: 'I KM devono essere maggiori di 0',
                },
                max: {
                  value: 999999,
                  message: 'I KM non possono superare 999.999',
                },
                validate: {
                  positive: (value) => value > 0 || 'I KM devono essere maggiori di 0',
                  // integer: (value) => Number.isInteger(value) || 'I KM devono essere un numero intero',
                },
              }}
            />
          </IonItem>
          <ErrorMessage errors={errors} name="km" as={<IonNote color="danger" style={{ padding: '0 16px', fontSize: '0.8em' }} />} />

          {/* Costo */}
          <IonItem>
            <Controller
              render={({ field }) => (
                <IonInput
                  labelPlacement="floating"
                  label="Costo (€)"
                  type="text"
                  inputmode="decimal"
                  name="costo"
                  value={field.value}
                  onIonChange={(e) => {
                    const value = parseFloat(e.detail.value!) || 0;
                    field.onChange(value);
                  }}
                  onIonBlur={() => {
                    field.onBlur();
                    if (field.value > 1000) {
                      field.onChange(field.value.toLocaleString('it-IT'));
                    }
                  }}
                  helperText={field.value > 0 ? `€ ${field.value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : undefined}
                  className={errors.costo ? 'ion-invalid ion-touched' : ''}
                />
              )}
              control={control}
              name="costo"
              rules={{
                required: 'Il campo Costo è obbligatorio',
                min: {
                  value: 0.01,
                  message: 'Il costo deve essere maggiore di 0',
                },
                max: {
                  value: 999999,
                  message: 'Il costo non può superare €999.999',
                },
                validate: {
                  positive: (value) => value > 0 || 'Il costo deve essere maggiore di 0',
                },
              }}
            />
          </IonItem>
          <ErrorMessage errors={errors} name="costo" as={<IonNote color="danger" style={{ padding: '0 16px', fontSize: '0.8em' }} />} />

          {/* Tipo */}
          <IonItem lines="inset" slot="header">
            <Controller
              render={({ field }) => (
                <IonSelect
                  labelPlacement="floating"
                  label="Tipo Manutenzione"
                  aria-label="Tipo Manutenzione"
                  interface="action-sheet"
                  placeholder="Seleziona tipo di manutenzione"
                  name="type"
                  value={field.value}
                  onIonChange={(e) => field.onChange(e.detail.value)}
                  onIonBlur={field.onBlur}
                  className={errors.type ? 'ion-invalid ion-touched' : ''}>
                  {maintenanceTypes.map((type) => (
                    <IonSelectOption key={type} value={type}>
                      {type}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              )}
              control={control}
              name="type"
              rules={{
                required: 'Seleziona un tipo di manutenzione',
                validate: {
                  validType: (value) => maintenanceTypes.includes(value) || 'Tipo di manutenzione non valido',
                },
              }}
            />
          </IonItem>
          <ErrorMessage errors={errors} name="type" as={<IonNote color="danger" style={{ padding: '0 16px', fontSize: '0.8em' }} />} />
        </IonList>

        <IonNote color="medium" class="ion-margin-horizontal">
          Aggiungi eventuali note.
        </IonNote>

        <IonList inset={true}>
          <IonItem>
            <Controller
              render={({ field }) => (
                <IonTextarea
                  label="Commento"
                  labelPlacement="floating"
                  name="note"
                  rows={5}
                  value={field.value}
                  onIonChange={field.onChange}
                  onIonBlur={field.onBlur}
                  placeholder="Inserisci eventuali note o commenti..."
                  helperText={field.value ? `${field.value.length}/500 caratteri` : undefined}
                  className={errors.note ? 'ion-invalid ion-touched' : ''}
                />
              )}
              control={control}
              name="note"
              rules={{
                maxLength: {
                  value: 500,
                  message: 'Le note non possono superare i 500 caratteri',
                },
                // validate: {
                //   noSpecialChars: (value) => {
                //     if (!value) return true;
                //     const regex = /^[a-zA-Z0-9\s.,!?àáèéìíòóùúÀÁÈÉÌÍÒÓÙÚ\-()]*$/;
                //     return regex.test(value) || 'Le note contengono caratteri non validi';
                //   }
                // }
              }}
            />
          </IonItem>
          <ErrorMessage errors={errors} name="note" as={<IonNote color="danger" style={{ padding: '0 16px', fontSize: '0.8em' }} />} />
        </IonList>

        <IonButton type="submit" expand="full" className="ion-margin" disabled={Object.keys(errors).length > 0}>
          {editData ? 'Modifica Manutenzione' : 'Aggiungi Manutenzione'}
        </IonButton>
      </form>

      {children}
    </IonContent>
  );
};
