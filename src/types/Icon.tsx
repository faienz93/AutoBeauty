import { car, speedometer, calendar } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

export const emoticosIcon = {
  car: '🚗',
  speedometer: '⚡',
  calendar: '📅',
  lightbulb: '💡',
  smile: '😉',
  hand: '👋',
  settings: '🔧',
};

export const icons = {
  car: <IonIcon icon={car} />,
  speedometer: <IonIcon icon={speedometer} />,
  calendar: <IonIcon icon={calendar} />,
};

export type EmoticosIcon = (typeof emoticosIcon)[keyof typeof emoticosIcon]; // string
export type Icon = (typeof icons)[keyof typeof icons]; // JSX.Element
