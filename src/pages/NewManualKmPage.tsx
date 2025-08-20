import { useEffect, useState } from 'react';
import { IonContent, IonButton, IonList, IonItem, IonToast, IonInput, IonPage, IonIcon, useIonViewWillLeave, useIonViewWillEnter, IonNote } from '@ionic/react';
import './ItemPage.css';
import DataPickerPopup from '../components/DataPickerPopup';
import { Header } from '../components/Header';
import { Kilometers } from '../types/KilometersType';
import { getDateToString, parseItalianNumber, getStringToDate } from '../utils/dateUtils';
import { useKilometersDb } from '../hooks/useDbContext';
import { pencilOutline } from 'ionicons/icons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const manualKmKey = 'manual-km';

interface IFormInputs {
  _rev?: string;
  data: string;
  km: number;
}

const NewManualKmPage: React.FC = () => {
  const dbKm = useKilometersDb();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      km: 0,
      data: getDateToString(),
    },
  });

  useIonViewWillEnter(() => {
    console.log('useIonViewWillEnter');
    setRefreshCount((rc) => rc + 1);
  });

  useEffect(() => {
    dbKm
      .get<Kilometers>(manualKmKey)
      .then((fetched) => {
        reset({
          _rev: fetched._rev ?? undefined,
          km: fetched.km ?? 0,
          data: fetched?.data ?? getDateToString(),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Errore nel recupero item', error);
        setLoading(false);
      });
  }, [dbKm, refreshCount, reset]);

  useIonViewWillLeave(() => {
    reset({
      data: getDateToString(),
      km: 0,
    });

    setIsSuccess(false);
  });

  if (loading) return <div>Caricamento…</div>;

  const updateManualKm = async (newKm: Kilometers) => {
    try {
      await dbKm.put(newKm);

      setIsSuccess((prevValue) => !prevValue);
    } catch (error) {
      console.error('Error adding Kilometer:', error);
      setIsSuccess(false);
    }
  };

  const onSubmitForm: SubmitHandler<IFormInputs> = async (event) => {
    try {
      const lastKm: Kilometers = {
        _id: 'manual-km',
        ...(event._rev && { _rev: event._rev }), // added _rev only if exist otherwise not
        data: getDateToString(getStringToDate(event.data)),
        km: parseItalianNumber(event.km),
      };
      await updateManualKm(lastKm);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    }
  };

  return (
    <IonPage>
      <Header title="KM" />
      <IonContent color="light">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <IonList inset={true}>
            {/* Data Picker */}
            <IonItem lines="inset" slot="header">
              <Controller
                render={({ field }) => (
                  <DataPickerPopup name="data" title="Scegli data" currentDate={field.value} onChange={(date: Date) => field.onChange(getDateToString(date))} />
                )}
                control={control}
                name="data"
                rules={{
                  required: 'La data è obbligatoria',
                  validate: {
                    notFuture: (value) => {
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      return getStringToDate(value) < today || 'La data non può essere nel futuro';
                    },
                  },
                }}
              />
            </IonItem>
            <ErrorMessage errors={errors} name="data" as={<IonNote color="danger" style={{ padding: '0 16px', fontSize: '0.8em' }} />} />

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
                      const value = parseFloat(e.detail.value!) || 0;
                      field.onChange(value);
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
          </IonList>

          <IonButton type="submit" expand="full" className="ion-margin" disabled={Object.keys(errors).length > 0}>
            <IonIcon slot="icon-only" icon={pencilOutline}></IonIcon>
            Modifica Kilometraggio
          </IonButton>
        </form>

        <IonToast
          isOpen={isSuccess}
          onDidDismiss={() => setIsSuccess((prevValue) => !prevValue)}
          message={isSuccess ? 'Kilometraggio aggiunto con successo!' : 'Errore durante la modifica del Kilometraggio'}
          duration={3000}
          color={isSuccess ? 'success' : 'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewManualKmPage;
