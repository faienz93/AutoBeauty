import { Header } from '../components/Header';
import { IonContent, IonPage } from '@ionic/react';
import ImportItem from '../components/ImportItem';
import ExportItem from '../components/ExportItem';
import DeleteAllItem from '../components/DeleteAllItems';

const Setting = () => {
  return (
    <IonPage>
      <Header title="Impostazioni" />
      <IonContent color="light">
        <ImportItem />
        <ExportItem />
        <DeleteAllItem />
      </IonContent>
    </IonPage>
  );
};

export default Setting;
