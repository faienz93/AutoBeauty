/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import {
  getDateToString,
  getStringToDate,
  parseItalianNumber,
  calculateDaysSinceLastMaintenance
} from '../src/utils/dateUtils';

describe('getDateToString', () => {
  it('should format a given date in it-IT locale', () => {
    const date = new Date(2025, 4, 10); // May 10, 2025
    const result = getDateToString(date);
    expect(result).toBe('10 mag 2025');
  });

  it('should use current date if no date is provided', () => {
    const result = getDateToString();
    // The result should match today's date in 'it-IT' format
    const today = new Date();
    const expected = today.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    expect(result).toBe(expected);
  });
});

describe('getStringToDate', () => {
  it('should parse "DD/MM/YY" format', () => {
    const date = getStringToDate('10/05/25');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(4);
    expect(date.getDate()).toBe(10);
  });

  it('should parse "DD/MM/YYYY" format', () => {
    const date = getStringToDate('10/05/2025');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(4);
    expect(date.getDate()).toBe(10);
  });

  it('should parse "DD MMM YYYY" format with Italian month', () => {
    const date = getStringToDate('10 mag 2025');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(4);
    expect(date.getDate()).toBe(10);
  });

  it('should throw error for invalid month', () => {
    expect(() => getStringToDate('10 xyz 2025')).toThrow(
      'Formato data non valido'
    );
  });
});

describe('parseItalianNumber', () => {
  it('should parse string with comma as decimal separator', () => {
    expect(parseItalianNumber('78,30')).toBeCloseTo(78.3);
  });

  it('should parse string with dot as decimal separator', () => {
    expect(parseItalianNumber('78.30')).toBeCloseTo(78.3);
  });

  it('should parse number input as is', () => {
    expect(parseItalianNumber(42)).toBe(42);
  });

  it('should return 0 for invalid input', () => {
    expect(parseItalianNumber('abc')).toBe(0);
    expect(parseItalianNumber('')).toBe(0);
    expect(parseItalianNumber(undefined as any)).toBe(0);
  });
});

describe('calculateDaysSinceLastMaintenance', () => {
  it('should calculate days since given date (DD/MM/YY)', () => {
    const now = new Date();
    const past = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    const dateStr = `${String(past.getDate()).padStart(2, '0')}/${String(past.getMonth() + 1).padStart(2, '0')}/${String(past.getFullYear()).slice(-2)}`;
    expect(calculateDaysSinceLastMaintenance(dateStr)).toBe(10);
  });

  it('should calculate days since given date (DD MMM YYYY)', () => {
    const now = new Date();
    const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5);
    const months = [
      'gen',
      'feb',
      'mar',
      'apr',
      'mag',
      'giu',
      'lug',
      'ago',
      'set',
      'ott',
      'nov',
      'dic'
    ];
    const dateStr = `${String(past.getDate()).padStart(2, '0')} ${months[past.getMonth()]} ${past.getFullYear()}`;
    expect(calculateDaysSinceLastMaintenance(dateStr)).toBe(5);
  });
});
