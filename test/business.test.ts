import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getMaintenanceKey,
  getUUIDKey,
  getMaintenanceWithHigherKm,
  getGroupByMaintenanceByKm,
  getMaxKmBetween,
  isMaintenanceNeededFor
} from '../src/utils/business';
import { Maintenance } from '../src/types/MaintenanceType';

describe('business.ts', () => {
  describe('getMaintenanceKey', () => {
    it('should return the maintenance prefix', () => {
      expect(getMaintenanceKey()).toBe('mnt-');
    });
  });

  describe('getUUIDKey', () => {
    it('should return a string starting with maintenance prefix', () => {
      const key = getUUIDKey();
      expect(key).toMatch(/^mnt-/);
    });

    it('should generate unique keys', () => {
      const key1 = getUUIDKey();
      const key2 = getUUIDKey();
      expect(key1).not.toBe(key2);
    });

    it('should generate keys with UUID format', () => {
      const key = getUUIDKey();
      // Remove prefix and check UUID v4 format
      const uuid = key.replace('mnt-', '');
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe('getMaintenanceWithHigherKm', () => {
    it('should return 0 for empty array', () => {
      expect(getMaintenanceWithHigherKm([])).toBe(0);
    });

    it('should return the only km value for single maintenance', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando'
        }
      ];
      expect(getMaintenanceWithHigherKm(maintenances)).toBe(5000);
    });

    it('should return the highest km value from multiple maintenances', () => {
      const maintenances: Maintenance[] = [
        { data: '01 Gen 2024', km: 5000, costo: 100, tipo: 'Tagliando' },
        { data: '01 Feb 2024', km: 12000, costo: 150, tipo: 'Gomme' },
        { data: '01 Mar 2024', km: 8000, costo: 200, tipo: 'Revisione' }
      ];
      expect(getMaintenanceWithHigherKm(maintenances)).toBe(12000);
    });

    it('should handle maintenances with same km values', () => {
      const maintenances: Maintenance[] = [
        { data: '01 Gen 2024', km: 10000, costo: 100, tipo: 'Tagliando' },
        { data: '01 Feb 2024', km: 10000, costo: 150, tipo: 'Gomme' }
      ];
      expect(getMaintenanceWithHigherKm(maintenances)).toBe(10000);
    });
  });

  describe('getMaxKmBetween', () => {
    it('should return lastManualKm when it is greater', () => {
      expect(getMaxKmBetween(15000, 12000)).toBe(15000);
    });

    it('should return maxMaintenanceKm when it is greater', () => {
      expect(getMaxKmBetween(10000, 15000)).toBe(15000);
    });

    it('should return the value when both are equal', () => {
      expect(getMaxKmBetween(10000, 10000)).toBe(10000);
    });

    it('should handle zero values', () => {
      expect(getMaxKmBetween(0, 5000)).toBe(5000);
      expect(getMaxKmBetween(5000, 0)).toBe(5000);
      expect(getMaxKmBetween(0, 0)).toBe(0);
    });
  });

  describe('isMaintenanceNeededFor', () => {
    beforeEach(() => {
      // Mock current date to 01 Jan 2025
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('Gomme (Tyres)', () => {
      it('should return true when km difference is exactly at TyreLimit (10000)', () => {
        expect(isMaintenanceNeededFor('Gomme', 10000, '01 Gen 2024')).toBe(true);
      });

      it('should return true when km difference exceeds TyreLimit', () => {
        expect(isMaintenanceNeededFor('Gomme', 12000, '01 Gen 2024')).toBe(true);
      });

      it('should return false when km difference is below TyreLimit', () => {
        expect(isMaintenanceNeededFor('Gomme', 9999, '01 Gen 2024')).toBe(false);
      });

      it('should return false when km difference is 0', () => {
        expect(isMaintenanceNeededFor('Gomme', 0, '01 Gen 2024')).toBe(false);
      });
    });

    describe('Tagliando (Service)', () => {
      it('should return true when km difference is exactly at MaintenanceLimit (15000)', () => {
        expect(isMaintenanceNeededFor('Tagliando', 15000, '01 Gen 2024')).toBe(
          true
        );
      });

      it('should return true when km difference exceeds MaintenanceLimit', () => {
        expect(isMaintenanceNeededFor('Tagliando', 20000, '01 Gen 2024')).toBe(
          true
        );
      });

      it('should return false when km difference is below MaintenanceLimit and less than 2 years', () => {
        expect(isMaintenanceNeededFor('Tagliando', 10000, '01 Gen 2024')).toBe(
          false
        );
      });

      it('should return true when km is low but 2 years have passed', () => {
        // Date is 01 Gen 2023, current mocked date is 01 Gen 2025 (2 years)
        expect(isMaintenanceNeededFor('Tagliando', 5000, '01 Gen 2023')).toBe(
          true
        );
      });

      it('should return true when km is low but more than 2 years have passed', () => {
        // Date is 01 Gen 2022, current mocked date is 01 Gen 2025 (3 years)
        expect(isMaintenanceNeededFor('Tagliando', 5000, '01 Gen 2022')).toBe(
          true
        );
      });

      it('should return false when exactly 1 year has passed', () => {
        expect(isMaintenanceNeededFor('Tagliando', 5000, '01 Gen 2024')).toBe(
          false
        );
      });

      it('should return true when both km and years conditions are met', () => {
        expect(isMaintenanceNeededFor('Tagliando', 15000, '01 Gen 2023')).toBe(
          true
        );
      });
    });

    describe('Revisione (Inspection)', () => {
      it('should return true when exactly 24 months have passed', () => {
        // 01 Gen 2023 to 01 Gen 2025 = 24 months
        expect(isMaintenanceNeededFor('Revisione', 0, '01 Gen 2023')).toBe(
          true
        );
      });

      it('should return true when more than 24 months have passed', () => {
        // 01 Gen 2022 to 01 Gen 2025 = 36 months
        expect(isMaintenanceNeededFor('Revisione', 0, '01 Gen 2022')).toBe(
          true
        );
      });

      it('should return false when less than 24 months have passed', () => {
        // 01 Feb 2023 to 01 Gen 2025 = 23 months
        expect(isMaintenanceNeededFor('Revisione', 0, '01 Feb 2023')).toBe(
          false
        );
      });

      it('should return false when exactly 23 months have passed', () => {
        // 01 Feb 2023 to 01 Gen 2025 = 23 months
        expect(isMaintenanceNeededFor('Revisione', 0, '01 Feb 2023')).toBe(
          false
        );
      });

      it('should return true when exactly 25 months have passed', () => {
        // 01 Dic 2022 to 01 Gen 2025 = 25 months
        expect(isMaintenanceNeededFor('Revisione', 0, '01 Dic 2022')).toBe(
          true
        );
      });

      it('should ignore km difference for Revisione', () => {
        // High km but less than 24 months
        expect(isMaintenanceNeededFor('Revisione', 50000, '01 Gen 2024')).toBe(
          false
        );
        // Low km but 24 months passed
        expect(isMaintenanceNeededFor('Revisione', 1000, '01 Gen 2023')).toBe(
          true
        );
      });
    });

    describe('Edge cases', () => {
      it('should return false for unknown maintenance type', () => {
        expect(isMaintenanceNeededFor('Unknown', 15000, '01 Gen 2024')).toBe(
          false
        );
      });

      it('should handle negative km difference', () => {
        expect(isMaintenanceNeededFor('Gomme', -1000, '01 Gen 2024')).toBe(
          false
        );
        expect(isMaintenanceNeededFor('Tagliando', -1000, '01 Gen 2024')).toBe(
          false
        );
      });
    });
  });

  describe('getGroupByMaintenanceByKm', () => {
    beforeEach(() => {
      // Mock current date to 01 Jan 2025
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return empty object for empty array', () => {
      expect(getGroupByMaintenanceByKm([], 10000)).toEqual({});
    });

    it('should group single maintenance correctly', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando'
        }
      ];

      const result = getGroupByMaintenanceByKm(maintenances, 15000);

      expect(result).toHaveProperty('Tagliando');
      expect(result?.Tagliando).toMatchObject({
        data: '01 Gen 2024',
        km: 5000,
        costo: 100,
        tipo: 'Tagliando'
      });
      expect(result?.Tagliando?.isNeeded).toBe(false); // 15000 - 5000 = 10000 km diff, < 15000 and < 2 years
    });

    it('should keep only the most recent maintenance per type', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando'
        },
        {
          data: '01 Giu 2024',
          km: 12000,
          costo: 150,
          tipo: 'Tagliando'
        },
        {
          data: '01 Mar 2024',
          km: 8000,
          costo: 120,
          tipo: 'Tagliando'
        }
      ];

      const result = getGroupByMaintenanceByKm(maintenances, 20000);

      // Should keep the one from 01 Giu 2024 (most recent)
      expect(result?.Tagliando?.data).toBe('01 Giu 2024');
      expect(result?.Tagliando?.km).toBe(12000);
    });

    it('should group different maintenance types separately', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando'
        },
        {
          data: '01 Feb 2024',
          km: 8000,
          costo: 150,
          tipo: 'Gomme'
        },
        {
          data: '01 Mar 2024',
          km: 10000,
          costo: 200,
          tipo: 'Revisione'
        }
      ];

      const result = getGroupByMaintenanceByKm(maintenances, 15000);

      expect(result).toHaveProperty('Tagliando');
      expect(result).toHaveProperty('Gomme');
      expect(result).toHaveProperty('Revisione');
      expect(Object.keys(result || {}).length).toBe(3);
    });

    it('should calculate isNeeded correctly based on km difference', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Gomme'
        }
      ];

      // maxKm = 15000, maintenance km = 5000, diff = 10000 (exactly TyreLimit)
      const result = getGroupByMaintenanceByKm(maintenances, 15000);
      expect(result?.Gomme?.isNeeded).toBe(true);
    });

    it('should calculate isNeeded as false when below threshold', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 6000,
          costo: 100,
          tipo: 'Gomme'
        }
      ];

      // maxKm = 15000, maintenance km = 6000, diff = 9000 (below TyreLimit of 10000)
      const result = getGroupByMaintenanceByKm(maintenances, 15000);
      expect(result?.Gomme?.isNeeded).toBe(false);
    });

    it('should handle mixed types with different isNeeded values', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2023',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando'
        }, // 2 years ago, should be needed
        {
          data: '01 Gen 2024',
          km: 12000,
          costo: 150,
          tipo: 'Gomme'
        } // only 3000 km diff, not needed
      ];

      const result = getGroupByMaintenanceByKm(maintenances, 15000);

      expect(result?.Tagliando?.isNeeded).toBe(true); // 2 years passed
      expect(result?.Gomme?.isNeeded).toBe(false); // only 3000 km diff
    });

    it('should preserve all maintenance properties including notes', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando',
          note: 'Test note'
        }
      ];

      const result = getGroupByMaintenanceByKm(maintenances, 15000);

      expect(result?.Tagliando?.note).toBe('Test note');
    });

    it('should handle maintenances with same type and date', () => {
      const maintenances: Maintenance[] = [
        {
          data: '01 Gen 2024',
          km: 5000,
          costo: 100,
          tipo: 'Tagliando'
        },
        {
          data: '01 Gen 2024',
          km: 6000,
          costo: 120,
          tipo: 'Tagliando'
        }
      ];

      const result = getGroupByMaintenanceByKm(maintenances, 15000);

      // When dates are equal, the last one in the array wins (due to reduce logic)
      expect(result?.Tagliando?.km).toBe(6000);
    });
  });
});
