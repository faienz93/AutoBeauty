import { useEffect, useState } from 'react';
import { IonContent, IonButton, IonList, IonItem, IonToast, IonInput, IonPage, IonIcon, IonText, useIonViewWillLeave, useIonViewWillEnter } from '@ionic/react';
import './ItemPage.css';
import DataPickerPopup from '../components/DataPickerPopup';
import { Header } from '../components/Header';
import { useHistory, useLocation } from 'react-router-dom';
import { Kilometers } from '../models/KilometersType';
import { getDateString, getUUIDKey, parseItalianNumber, parseStringToDate } from '../services/utils';
import { useKilometersDb } from '../hooks/useDbContext';
import { pencilOutline } from 'ionicons/icons';

interface KmState {
  item: Kilometers;
}

function KmPage() {

  const history = useHistory();

  // https://stackoverflow.com/a/59464381/4700162
  const location = useLocation<KmState>();
  console.log(location.state)

  console.log('Rendering NewItem component');
  const dbKm = useKilometersDb();
  const [isSuccess, setIsSuccess] = useState(false);

  const currentDate = getDateString();
  const [formData, setFormData] = useState<Kilometers>({
    data: currentDate,
    km: 0,
  });


  const [didEdit, setDidEdit] = useState({
    data: false,
    km: false,
  });


  const kmNotValid = didEdit.km && (formData.km === 0 || formData.km === null || formData.km === undefined);

  const handleAddKm = async (newKm: Kilometers) => {

    console.log('Adding new Kilometer:', newKm);
    let newEvent: Kilometers;
    if (location.state?.item?._rev) {
      console.log(location.state)
      newEvent = {
        ...newKm,
        _rev: location.state.item._rev
      };
    } else {
      newEvent = newKm;
    }

    try {

      const response = await dbKm.put(newEvent)

      console.log('Kilometer added successfully:', response);
      setIsSuccess(prevValue => !prevValue)
      setFormData({
        data: currentDate,
        km: 0
      });
    } catch (error) {
      console.error('Error adding Kilometer:', error);
      setIsSuccess(false);
    }


  };

  const handleInputChange = (inputIdentifier: any, newValue: any) => {
    if (inputIdentifier === 'data') {
      newValue = getDateString(newValue);
    }

    setFormData((prevState) => ({
      ...prevState,
      [inputIdentifier]: newValue,
    }));

    setDidEdit((prevEdit) => ({
      ...prevEdit,
      [inputIdentifier]: false,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setDidEdit(prev => ({
      ...prev,
      km: true
    }));

    if(kmNotValid){
      setIsSuccess(false);
      return;
    }


    try {

      const lastKm: Kilometers = {
        _id: 'manual-km',
        data: getDateString(parseStringToDate(formData.data)),
        km: parseItalianNumber(formData.km),
      };
      await handleAddKm(lastKm);

    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    }
  };


  const handleInputBlur = (identifier: any) => {
    setDidEdit((prevEdit) => ({
      ...prevEdit,
      [identifier]: true,
    }));
  }


  useEffect(() => {
    if (location.state?.item) {
      setFormData({
        _id: location.state.item._id,
        _rev: location.state.item._rev,
        data: location.state.item.data,
        km: location.state.item.km
      });
    }
    // eslint-disable-next-line
  }, [location.state]);


  useIonViewWillLeave(() => {
    
    setFormData({
      data: currentDate,
      km: 0
    });
    setIsSuccess(false);
    setDidEdit({
      data: false,
      km: false,
    })

    // history.replace({ ...location, state: undefined });
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
              {kmNotValid && <p style={{ margin: '4px 0' }}>
                Per favore inserisci un kilometraggio diverso da 0.
              </p>}
            </IonText>
          </div>

        </IonList>

        <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleSubmit} disabled={kmNotValid}>
          <IonIcon slot="icon-only" ios={pencilOutline} md={pencilOutline}></IonIcon>
          Modifica Kilometraggio
        </IonButton>

        <IonToast
          isOpen={isSuccess}
          onDidDismiss={() => setIsSuccess(prevValue => !prevValue)}
          message={isSuccess ? "Kilometraggio aggiunto con successo!" : "Errore durante la modifica del Kilometraggio"}
          duration={3000}
          color={isSuccess ? "success" : "danger"}
        />
      </IonContent>
    </IonPage>
  );
}

export default KmPage;
