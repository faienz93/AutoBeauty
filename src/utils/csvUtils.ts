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
