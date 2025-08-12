import { useEffect, useState } from 'react';
import { IonContent, IonButton, IonList, IonItem, IonToast, IonInput, IonPage, IonIcon, IonText, useIonViewWillLeave } from '@ionic/react';
import './ItemPage.css';
import DataPickerPopup from '../components/DataPickerPopup';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseItalianNumber, parseStringToDate } from '../utils/dateUtils';
import { useKilometersDb } from '../hooks/useDbContext';
import { pencilOutline } from 'ionicons/icons';

interface KmState {
  item: Kilometers;
}

function KmPage() {
  // https://stackoverflow.com/a/59464381/4700162
  const location = useLocation<KmState>();
  const currentDate = getDateString();
  console.log('Rendering KmPage component');
  const dbKm = useKilometersDb();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Kilometers>({
    data: currentDate,
    km: 0,
  });
  const [didEdit, setDidEdit] = useState({
    data: false,
    km: false,
  });

  const isKmInvalid = didEdit.km && Number(formData.km) === 0;

  const updateKm = async (newKm: Kilometers) => {
    console.log('Adding new Kilometer:', newKm);
    let newEvent: Kilometers;
    console.log(location.state?.item);
    if (location.state?.item?._rev) {
      newEvent = {
        ...newKm,
        _rev: location.state.item._rev,
      };
    } else {
      newEvent = newKm;
    }

    try {
      const response = await dbKm.put(newEvent);
      console.log('Kilometer added successfully:', response);
      location.state.item._rev = response.rev;
      setIsSuccess((prevValue) => !prevValue);
    } catch (error) {
      console.error('Error adding Kilometer:', error);
      setIsSuccess(false);
    }
  };

  const handleInputChange = (inputIdentifier: any, newValue: any) => {
    if (inputIdentifier === 'data') {
      newValue = getDateString(parseStringToDate(newValue as string));
    }

    if (inputIdentifier === 'km') {
      // IonInput type="number" restituisce stringa, convertiamo
      const numericValue = parseFloat(newValue as string);
      newValue = isNaN(numericValue) ? '' : numericValue; // Mantieni stringa vuota se non è un numero, o gestisci come preferisci
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (didEdit.km && Number(formData.km) === 0) return;

    try {
      const lastKm: Kilometers = {
        _id: 'manual-km',
        data: getDateString(parseStringToDate(formData.data)),
        km: parseItalianNumber(formData.km),
      };
      await updateKm(lastKm);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    }
  };

  const handleInputBlur = (identifier: any) => {
    setDidEdit((prevEdit) => ({
      ...prevEdit,
      [identifier]: true,
    }));
  };

  useEffect(() => {
    if (location.state?.item) {
      setFormData({
        _id: location.state.item._id,
        _rev: location.state.item._rev || undefined,
        data: location.state.item.data,
        km: location.state.item.km,
      });
    }
  }, [location.state?.item]);

  useIonViewWillLeave(() => {
    setFormData({
      data: currentDate,
      km: 0,
    });
    setIsSuccess(false);
    setDidEdit({
      data: false,
      km: false,
    });
  });

  return (
    <IonPage>
      <Header title="KM" />
      <IonContent color="light">
        <IonList inset={true}>
          <IonItem lines="inset" slot="header">
            <DataPickerPopup title="Scegli data" currentDate={formData.data} onChange={handleInputChange} />
          </IonItem>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              label="KM"
              type="number"
              name="km"
              onBlur={() => handleInputBlur('km')}
              value={formData.km}
              onIonChange={(e) => handleInputChange('km', e.detail.value)}
              min={0}
            />
          </IonItem>
          <div style={{ padding: '0 16px' }}>
            <IonText color="danger" style={{ fontSize: '0.8em' }}>
              {isKmInvalid && <p style={{ margin: '4px 0' }}>Per favore inserisci un kilometraggio diverso da 0.</p>}
            </IonText>
          </div>
        </IonList>

        <IonButton id="open-toast" type="submit" expand="full" className="buttonAddList" onClick={handleSubmit} disabled={isKmInvalid}>
          <IonIcon slot="icon-only" ios={pencilOutline} md={pencilOutline}></IonIcon>
          Modifica Kilometraggio
        </IonButton>

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
}

export default KmPage;
