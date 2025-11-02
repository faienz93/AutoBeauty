/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CsvService } from '../src/services/csv/csvParser';
import Papa from 'papaparse';

// Mock di PapaParse
vi.mock('papaparse');

describe('CsvService', () => {
  let service: CsvService<any>;

  beforeEach(() => {
    service = new CsvService();
    vi.clearAllMocks();
  });

  describe('importCsv', () => {
    it('should parse a CSV file with headers successfully', async () => {
      const mockData = [
        { name: 'John', age: '30' },
        { name: 'Jane', age: '25' }
      ];

      const csvContent = 'name,age\nJohn,30\nJane,25';

      // Crea un mock del File con il metodo text()
      const mockFile = {
        name: 'test.csv',
        type: 'text/csv',
        text: vi.fn().mockResolvedValue(csvContent)
      } as unknown as File;

      // Mock della funzione parse di Papa
      vi.mocked(Papa.parse).mockImplementation((input: any, config: any) => {
        // Simula il comportamento asincrono
        setTimeout(() => {
          config.complete({
            data: mockData,
            errors: [],
            meta: {}
          });
        }, 0);
        return {} as any;
      });

      const result = await service.importCsv(mockFile, true);

      expect(result).toEqual(mockData);
      expect(Papa.parse).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          header: true,
          skipEmptyLines: true
        })
      );
    });

    it('should parse a CSV file without headers', async () => {
      const mockData = [
        ['John', '30'],
        ['Jane', '25']
      ];

      const csvContent = 'name,age\nJohn,30\nJane,25';

      // Crea un mock del File con il metodo text()
      const mockFile = {
        name: 'test.csv',
        type: 'text/csv',
        text: vi.fn().mockResolvedValue(csvContent)
      } as unknown as File;

      vi.mocked(Papa.parse).mockImplementation((input: any, config: any) => {
        setTimeout(() => {
          config.complete({
            data: mockData,
            errors: [],
            meta: {}
          });
        }, 0);
        return {} as any;
      });

      const result = await service.importCsv(mockFile, false);

      expect(result).toEqual(mockData);
      expect(Papa.parse).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          header: false
        })
      );
    });

    it('should reject when parsing errors occur', async () => {
      const csvContent = 'name,age\nJohn,30\nJane,25';

      // Crea un mock del File con il metodo text()
      const mockFile = {
        name: 'test.csv',
        type: 'text/csv',
        text: vi.fn().mockResolvedValue(csvContent)
      } as unknown as File;

      vi.mocked(Papa.parse).mockImplementation((input: any, config: any) => {
        setTimeout(() => {
          config.complete({
            data: [],
            errors: [
              {
                message: 'Parse error',
                type: 'Quotes',
                code: 'UndetectableDelimiter'
              }
            ],
            meta: {}
          });
        }, 0);
        return {} as any;
      });

      await expect(service.importCsv(mockFile)).rejects.toThrow(
        'Error parsing CSV: Parse error'
      );
    });

    it('should reject when Papa.parse calls error callback', async () => {
      const csvContent = 'test';

      // Crea un mock del File con il metodo text()
      const mockFile = {
        name: 'test.csv',
        type: 'text/csv',
        text: vi.fn().mockResolvedValue(csvContent)
      } as unknown as File;

      vi.mocked(Papa.parse).mockImplementation((input: any, config: any) => {
        setTimeout(() => {
          config.error(new Error('Critical parsing error'));
        }, 0);
        return {} as any;
      });

      await expect(service.importCsv(mockFile)).rejects.toThrow(
        'CSV parsing error: Critical parsing error'
      );
    });

    it('should handle file reading errors', async () => {
      const mockFile = {
        text: vi.fn().mockRejectedValue(new Error('File read error'))
      } as any;

      await expect(service.importCsv(mockFile)).rejects.toThrow(
        'Error reading file'
      );
    });
  });

  describe('exportCsvWithBlob', () => {
    it('should export data to CSV Blob successfully', () => {
      const mockData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];
      const headers = ['name', 'age'];
      const mockCsvString = 'name|age\nJohn|30\nJane|25';

      vi.mocked(Papa.unparse).mockReturnValue(mockCsvString);

      const result = service.exportCsvWithBlob(mockData, headers);

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('text/csv;charset=utf-8;');
      expect(Papa.unparse).toHaveBeenCalledWith(mockData, {
        delimiter: '|',
        header: true,
        columns: headers
      });
    });

    it('should throw error when unparse fails', () => {
      const mockData = [{ name: 'John' }];
      const headers = ['name'];

      vi.mocked(Papa.unparse).mockImplementation(() => {
        throw new Error('Unparse error');
      });

      expect(() => service.exportCsvWithBlob(mockData, headers)).toThrow(
        'Unparse error'
      );
    });
  });

  describe('exportCsv', () => {
    it('should export data to CSV string successfully', () => {
      const mockData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];
      const headers = ['name', 'age'];
      const mockCsvString = 'name|age\nJohn|30\nJane|25';

      vi.mocked(Papa.unparse).mockReturnValue(mockCsvString);

      const result = service.exportCsv(mockData, headers);

      expect(result).toBe(mockCsvString);
      expect(Papa.unparse).toHaveBeenCalledWith(mockData, {
        delimiter: '|',
        header: true,
        columns: headers
      });
    });

    it('should throw error when unparse fails', () => {
      const mockData = [{ name: 'John' }];
      const headers = ['name'];

      vi.mocked(Papa.unparse).mockImplementation(() => {
        throw new Error('Unparse error');
      });

      expect(() => service.exportCsv(mockData, headers)).toThrow(
        'Unparse error'
      );
    });

    it('should handle empty data array', () => {
      const mockData: any[] = [];
      const headers = ['name', 'age'];
      const mockCsvString = 'name|age\n';

      vi.mocked(Papa.unparse).mockReturnValue(mockCsvString);

      const result = service.exportCsv(mockData, headers);

      expect(result).toBe(mockCsvString);
    });
  });
});
