import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PageHeader from '../src/ui/PageHeader';

describe('PageHeader', () => {
  const defaultProps = {
    userName: 'Antonio',
    totalMaintenances: 5,
    lastManualKm: 12000,
    maxMaintenanceKm: 15000,
    daysSinceLastMaintenance: 10,
    isMaitenanceNeeded: false,
    hasMaintenances: true,
    isWrongKilometers: false
  };

  it('renders WelcomeSection with userName', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByText(/Antonio/i)).toBeInTheDocument();
  });

  it('renders StatCards when hasMaintenances is true', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByText(/Totale Manutenzioni/i)).toBeInTheDocument();
    expect(screen.getByText(/Ultimo Km manuale/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Giorni dall'ultima manutenzione/i)
    ).toBeInTheDocument();
  });

  it('renders NoMainteinance when hasMaintenances is false', () => {
    render(<PageHeader {...defaultProps} hasMaintenances={false} />);
    expect(screen.getByText(/no maintenance/i)).toBeInTheDocument();
  });

  it('shows "Manutenzione necessaria" status when isMaitenanceNeeded is true', () => {
    render(<PageHeader {...defaultProps} isMaitenanceNeeded={true} />);
    expect(screen.getByText(/Manutenzione necessaria/i)).toBeInTheDocument();
  });

  it('shows "Stato veicolo ottimale" status when isMaitenanceNeeded is false', () => {
    render(<PageHeader {...defaultProps} isMaitenanceNeeded={false} />);
    expect(screen.getByText(/Stato veicolo ottimale/i)).toBeInTheDocument();
  });

  it('shows warning StatusIndicator when isWrongKilometers is true', () => {
    render(<PageHeader {...defaultProps} isWrongKilometers={true} />);
    expect(
      screen.getByText(
        new RegExp(
          `Il Km manuale \\(${defaultProps.lastManualKm} km\\) < del max \\(${defaultProps.maxMaintenanceKm} km\\)\\.\\nSi userà il maggiore\\.`
        )
      )
    ).toBeInTheDocument();
  });

  it('renders children if provided', () => {
    render(
      <PageHeader {...defaultProps}>
        <div>Test Child</div>
      </PageHeader>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
