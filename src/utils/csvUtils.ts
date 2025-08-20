import { Capacitor } from '@capacitor/core';
import { CsvService } from '../services/csv/csvParser';
import { Maintenance } from '../types/MaintenanceType';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';

/**
 * Converts an array of objects into a CSV (Comma Separated Values) string.
 *
 * @param data - An array of objects to convert. Each object's keys will be used as CSV headers.
 * @param columns - An optional array of strings specifying the order and selection of columns.
 *                  If not provided, all keys from the first object will be used as columns.
 * @returns A string representing the CSV data.
 *
 * @example
 * ```typescript
 * const myData = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * const csv = convertToCSV(myData);
 * // Expected output (approximately):
 * // "id,name\n1,Alice\n2,Bob"
 *
 * const csvWithColumns = convertToCSV(myData, ['name', 'id']);
 * // Expected output (approximately):
 * // "name,id\nAlice,1\nBob,2"
 * ```
 */
export const convertToCSV = (data: Record<string, unknown>[], columns?: string[]): string => {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = columns || Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle cases where value might contain commas or newlines
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`; // Enclose in double quotes and escape existing double quotes
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};
/**
 * Converts a Blob object into a Base64 string (data URL).
 * @param blob The Blob object to convert.
 * @returns A Promise that resolves with the result as a data URL, which can be a string, an ArrayBuffer, or null.
 */
export const convertBlobToBase64 = (blob: Blob): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

/**
 * Starts the download of a file in the browser by creating a temporary link.
 * @param filename The name to assign to the downloaded file.
 * @param data The file data in the form of a Blob.
 * @returns A Promise that resolves with `true` when the download starts, or rejects in case of an error.
 */
export const downloadFile = (filename: string, data: Blob): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // REF: https://dev.to/graciesharma/implementing-csv-data-export-in-react-without-external-libraries-3030
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', filename);

      // Add event listeners to track success/failure
      link.addEventListener('click', () => {
        setTimeout(() => {
          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          resolve(true);
        }, 100);
      });

      link.addEventListener('error', (error) => {
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        reject(error);
      });

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a CSV file from maintenance data and returns it as a Blob and Base64 string.
 * @param maintenance - An array of Maintenance objects to convert to CSV.
 * @returns A Promise that resolves with an object containing the Blob and Base64 representation of the CSV.
 */
const generateCsvBase64 = async (maintenance: Maintenance[]): Promise<{ blob: Blob; base64: string }> => {
  const csvService = new CsvService<Maintenance>();
  const blob = await csvService.exportCsvWithBlob(maintenance, ['data', 'km', 'tipo', 'costo', 'note']);
  const base64 = (await convertBlobToBase64(blob)) as string;
  return { blob, base64 };
};

/**
 * Exports maintenance data to a CSV file and allows sharing it on native platforms or downloading it in the browser.
 * @param maintenance - An array of Maintenance objects to export.
 * @param filename - The name of the CSV file (defaults to 'maintenance.csv').
 * @returns A Promise that resolves with an object containing a message and a color indicating the outcome.
 */

export const exportOnShare = async (
  maintenance: Maintenance[],
  filename: string = 'template_manutenzioni.csv',
): Promise<{ message: string; color: 'success' | 'warning' | 'danger' }> => {
  const { blob, base64 } = await generateCsvBase64(maintenance);

  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'Template manutenzioni',
        text: 'Template pronto! Suggerimento: salva nella cartella "Download".',
        url: result.uri,
        dialogTitle: 'Condividi il file con…',
      });

      return { message: `File salvato in correttamente!`, color: 'success' };
    } catch (error) {
      console.error('Errore durante il salvataggio del file:', error);
      return { message: 'Errore durante il salvataggio del file. Riprova.', color: 'warning' };
    }
  } else {
    await downloadFile(filename, blob);
    return { message: `File salvato correttamente`, color: 'success' };
  }
};

/**
 * Exports maintenance data to a CSV file and saves it to the device's file system.
 * On native platforms, it handles permission requests and platform-specific directory selection.
 * In the browser, it triggers a download.
 * @param maintenance - An array of Maintenance objects to export.
 * @param filename - The name of the CSV file (defaults to 'maintenance.csv').
 * @returns A Promise that resolves with an object containing a message and a color indicating the outcome.
 */
export const exportOnFileSystem = async (
  maintenance: Maintenance[],
  filename: string = 'template_manutenzioni.csv',
): Promise<{ message: string; color: 'success' | 'warning' | 'danger' }> => {
  const { blob: csvDataBlob, base64: base64Data } = await generateCsvBase64(maintenance);

  if (Capacitor.isNativePlatform()) {
    const permissionResult = await Filesystem.checkPermissions();

    if (permissionResult.publicStorage !== 'granted') {
      const permissionRequest = await Filesystem.requestPermissions();
      if (permissionRequest.publicStorage !== 'granted') {
        console.error("Permesso di salvataggio non concesso dall'utente.");

        return { message: 'Permesso negato. Riprova.', color: 'warning' };
      }
    }

    const deviceInfo = await Device.getInfo();
    const androidVersion = parseInt(deviceInfo.osVersion || '0', 10);

    let targetDirectory: Directory = Directory.Documents;
    if (deviceInfo.platform === 'android') {
      if (androidVersion <= 9) {
        targetDirectory = Directory.ExternalStorage;
      } else {
        targetDirectory = Directory.Documents;
      }
    }

    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: targetDirectory,
      });

      return { message: `File salvato in: ${result.uri}`, color: 'success' };
    } catch (error) {
      console.error('Errore durante il salvataggio del file:', error);
      return { message: 'Permesso negato. Riprova.', color: 'warning' };
    }
  } else {
    await downloadFile(filename, csvDataBlob);
    return { message: `File salvato correttamente`, color: 'success' };
  }
};
