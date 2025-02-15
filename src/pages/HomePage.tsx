import React from 'react';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { Header } from './Header';

const HomePage = () => (
    <>
        <Header title='Home' showBackButton={false}/>
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

export default HomePage;