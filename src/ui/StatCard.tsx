import { useState } from 'react';
import { Colors } from '../types/Color';
import { EmojisIcon, Icon } from '../types/Icon';

interface StatCardProps {
  icon: Icon | EmojisIcon;
  label: string;
  value: number;
  iconColor: string;
  color: Colors;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, iconColor, color, index }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const isHovered = hoveredCard === index;

  return (
    <div
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        backgroundColor: color.white,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: isHovered ? '0 8px 32px rgba(56, 128, 255, 0.15)' : '0 2px 16px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: `2px solid ${isHovered ? color.primary : 'transparent'}`,
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
          color: color.dark,
          marginBottom: '8px',
          lineHeight: '1.2',
        }}>
        {typeof value === 'number' && value > 1000 ? value.toLocaleString('it-IT') : value}
      </div>

      <div
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: color.medium,
          lineHeight: '1.4',
          maxWidth: '120px',
        }}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
