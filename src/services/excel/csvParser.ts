import Papa from "papaparse";


export class CsvService<T> {


  async importCsv(file: File, columnHeader: boolean = true): Promise<T[]> {

    try {
      const text = await file.text();

      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error('No file provided'));
          return;
        }

        Papa.parse(text, {
          header: columnHeader,
          skipEmptyLines: true,
          error: (error: any) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          },
          complete: (results: any) => {
            if (results.errors.length > 0) {
              const msg = `Error parsing CSV: ${results.errors.map((err: any) => err.message).join(', ')}`;
              reject(msg);
              return;
            }

            try {
              const parsedData = results.data as T[];
              resolve(parsedData);
            } catch (error) {
              reject(new Error(`Error converting data: ${error}`));
            }
          }
        });
      });

    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error(`Error reading file: ${error}`);
    }

  }

  exportCsvWithBlob(data: T[], header: string[]): Blob {

    try {
      const csv = Papa.unparse(data, {
        delimiter: '|',
        header: true,
        columns: header
      });
      const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      return csvData;
    } catch (error) {
      console.error('Errore esportazione:', error);
      throw error;
    }
    
  }


  


  exportCsv(data: T[], header: string[]): String {

    try {
      const csv = Papa.unparse(data, {
        delimiter: '|',
        header: true,
        columns: header
      });
      
      return csv;
    } catch (error) {
      console.error('Errore esportazione:', error);
      throw error;
    }
    
  }
}
