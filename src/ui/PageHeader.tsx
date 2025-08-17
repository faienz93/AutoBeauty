import React, { useState } from 'react';
import { car, speedometer, calendar } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { getDateString } from '../utils/dateUtils';

const PageHeader = ({ userName = 'Utente', totalMaintenances = 12, lastKm = 45780, daysSinceLastMaintenance = 15 }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Ionic-inspired color palette
  const colors = {
    primary: '#3880ff',
    primaryShade: '#3171e0',
    primaryTint: '#4c8dff',
    secondary: '#3dc2ff',
    success: '#2dd36f',
    warning: '#ffc409',
    danger: '#eb445a',
    light: '#f4f5f8',
    medium: '#92949c',
    dark: '#222428',
    white: '#ffffff',
    gradientStart: '#3880ff',
    gradientEnd: '#3171e0',
  };

  const icons = {
    car: <IonIcon icon={car} />,
    speedometer: <IonIcon icon={speedometer} />,
    calendar: <IonIcon icon={calendar} />,
  };
  const StatCard = ({ icon, label, value, iconColor, index }) => {
    const isHovered = hoveredCard === index;

    return (
      <div
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          backgroundColor: colors.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: isHovered ? '0 8px 32px rgba(56, 128, 255, 0.15)' : '0 2px 16px rgba(0, 0, 0, 0.1)',
          transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          border: `2px solid ${isHovered ? colors.primary : 'transparent'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '160px',
          justifyContent: 'center',
        }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: `${iconColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: `2px solid ${iconColor}30`,
            fontSize: '24px',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}>
          {icon}
        </div>

        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: colors.dark,
            marginBottom: '8px',
            lineHeight: '1.2',
          }}>
          {typeof value === 'number' && value > 1000 ? value.toLocaleString('it-IT') : value}
        </div>

        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: colors.medium,
            lineHeight: '1.4',
            maxWidth: '120px',
          }}>
          {label}
        </div>
      </div>
    );
  };

  const getStatusMessage = () => {
    if (daysSinceLastMaintenance > 30) {
      return { text: 'Manutenzione raccomandata', color: colors.warning };
    } else if (daysSinceLastMaintenance > 60) {
      return { text: 'Manutenzione urgente', color: colors.danger };
    } else {
      return { text: 'Stato veicolo ottimale', color: colors.success };
    }
  };

  const status = getStatusMessage();

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
        minHeight: '420px',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '40px',
      }}>
      {/* Background decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '-30px',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '32px 16px 0',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
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
            Ciao, {userName}! 👋
          </h1>

          <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px', fontWeight: '500' }}>
            {icons.calendar} {getDateString()}
          </div>
          <p
            style={{
              fontSize: window.innerWidth <= 768 ? '16px' : '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.5',
            }}>
            Benvenuto nel tuo centro di controllo per la manutenzione del veicolo
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto 32px auto',
          }}>
          <StatCard icon={icons.car} label="Totale Manutenzioni" value={totalMaintenances} iconColor={colors.primary} index={0} />

          <StatCard icon={icons.speedometer} label="Ultimi km Registrati" value={lastKm} iconColor={colors.success} index={1} />

          <StatCard icon={icons.calendar} label="Giorni dall'ultima manutenzione" value={daysSinceLastMaintenance} iconColor={colors.warning} index={2} />
        </div>

        {/* Status Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '12px 24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: status.color,
                borderRadius: '50%',
                marginRight: '12px',
                boxShadow: `0 0 8px ${status.color}60`,
              }}
            />
            <span
              style={{
                color: colors.white,
                fontSize: '14px',
                fontWeight: '500',
              }}>
              {status.text}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '60px',
          overflow: 'hidden',
        }}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
          }}>
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            style={{
              fill: colors.white,
              opacity: 0.1,
            }}
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            style={{
              fill: colors.white,
              opacity: 0.2,
            }}
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            style={{
              fill: colors.white,
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default PageHeader;
