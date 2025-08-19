import React from 'react';
import { colors } from '../types/Color';
import { emojisIcon } from '../types/Icon';
import { getDateToString } from '../utils/dateUtils';

interface WelcomeSectionProps {
  userName?: string;
  hasMaintenances: boolean;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName, hasMaintenances }) => {
  return (
    <>
      {/* Welcome Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: window.innerWidth <= 768 ? '32px' : '42px',
            fontWeight: '700',
            color: colors.white,
            margin: '0 0 16px 0',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
          {userName ? `Ciao, ${userName}! ${emojisIcon.hand}` : `Ciao! ${emojisIcon.hand}`}
        </h1>

        {/* Date Indicator */}
        <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px', fontWeight: '500' }}>
          {emojisIcon.calendar} {getDateToString()}
        </div>

        <p
          style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.5',
          }}>
          {hasMaintenances ? 'Benvenuto nel tuo centro di controllo per la manutenzione del veicolo' : 'Inizia a tracciare le manutenzioni del tuo veicolo'}
        </p>
      </div>
    </>
  );
};
