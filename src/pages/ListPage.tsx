import React from 'react';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';

const ListPage = () => (
    <>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/home"></IonBackButton>
                </IonButtons>
                <IonTitle>List Maintenance</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                List content
            </div>
        </IonContent>
    </>
);

export default ListPage;