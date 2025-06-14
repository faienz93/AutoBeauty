import { useState } from 'react';
import { IonContent, IonButton, IonList, IonItem, IonToast, IonInput, IonPage } from '@ionic/react';
import './ItemPage.css';
import DataPickerPopup from '../components/DataPickerPopup';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';
import { Kilometers } from '../models/KilometersType';
import { getDateString, getUUIDKey, parseItalianNumber, parseStringToDate } from '../services/utils';
import { useKilometersDb } from '../hooks/useDbContext';

interface KmState {
  item: Kilometers;
}

function KmPage() {

  // https://stackoverflow.com/a/59464381/4700162
  const location = useLocation<KmState>();
  console.log(location.state?.item)

  console.log('Rendering NewItem component');
  const dbKm = useKilometersDb();
  const [isSuccess, setIsSuccess] = useState(false);

  const currentDate = getDateString();
  const [formData, setFormData] = useState(() => {

    if (location.state?.item) {
      // aggiornamento
      return {
        _id: location.state.item._id,
        _rev: location.state.item._rev,
        data: location.state.item.data,
        km: location.state.item.km
      };
    }

    return {
      data: currentDate,
      km: 0,
    }
  });



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
      setIsSuccess(true);
      setFormData({
        data: currentDate,
        km: 0
      });
    }catch (error) {
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
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      
      const lastKm: Kilometers = {
        _id: 'manual-km',
        data: getDateString(parseStringToDate(formData.data)), 
        km: parseItalianNumber(formData.km) ,
      };
      await handleAddKm(lastKm);
      
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    }
  };




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
              value={formData.km}
              onIonChange={(e) => handleInputChange('km', e.detail.value)}
              min={0}
            />
          </IonItem>
        </IonList>
        {location.state?.item ?
          <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleSubmit}>
            Modifica Kilometraggio
          </IonButton>
          :
          <IonButton id="open-toast" expand="full" className="buttonAddList" onClick={handleSubmit}>
            Aggiungi Kilometraggio
          </IonButton>
        }

        {isSuccess ? (
          <IonToast trigger="open-toast" color="success" style={{ text: 'white' }} message="Kilometraggio aggiunto con successo!" duration={5000}></IonToast>
        ) : (
          <IonToast trigger="open-toast" color="danger" message="Errore durante l'aggiunta del Kilometraggio" duration={1000}></IonToast>
        )}
      </IonContent>
    </IonPage>
  );
}

export default KmPage;
